import os
import json
import logging
import requests
from dotenv import load_dotenv

load_dotenv()
import numpy as np
from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
from vector_store import OllamaVectorStore
from ingest import ingest_documents

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__, static_folder='.')
CORS(app)

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
INDEX_PATH = "vector_index.json"
DATA_DIR = "./data"

# Global vector store instance
vector_store = OllamaVectorStore(index_path=INDEX_PATH, ollama_url=OLLAMA_URL)

# In-memory session memory
# Format: { session_id: [ {role: "user"|"assistant", content: "..."} ] }
session_memories = {}

# Ensure data directory exists and run initial ingestion if index doesn't exist
if not os.path.exists(INDEX_PATH):
    try:
        logging.info("Vector index not found. Performing initial document ingestion...")
        ingest_documents(data_dir=DATA_DIR, index_path=INDEX_PATH, ollama_url=OLLAMA_URL)
    except Exception as e:
        logging.error(f"Initial ingestion failed: {e}")

# Load the vector store index
vector_store.load()

# Predefined Schemes for the Schemes Explorer and Eligibility Checker
SCHEMES_DATA = [
    {
        "id": "pm-kisan",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "department": "Department of Agriculture and Farmers Welfare",
        "eligibility_desc": "Landholding farmers, age >= 18, exclusions apply",
        "last_updated": "2026-06-15",
        "status": "Active",
        "benefits": ["Rs. 6,000 per year in three equal installments of Rs. 2,000", "Direct benefit transfer to bank account"],
        "required_docs": ["Aadhaar Card", "Land Registry Documents", "Bank Account Passbook"],
        "rules": {
            "min_age": 18,
            "requires_land": "Yes",
            "occupation_exclude": ["Institutional Landholder", "Taxpayer", "Government Employee"]
        }
    },
    {
        "id": "ayushman-bharat",
        "name": "Ayushman Bharat (PM-JAY)",
        "department": "National Health Authority",
        "eligibility_desc": "Families matching socio-economic caste census criteria, low income",
        "last_updated": "2026-05-20",
        "status": "Active",
        "benefits": ["Health insurance cover of up to Rs. 5 Lakhs per family per year", "Cashless treatment at empaneled hospitals"],
        "required_docs": ["Aadhaar/Ration Card", "PM-JAY ID letter", "Income Certificate"],
        "rules": {
            "max_income": 120000,
            "occupations": ["Manual laborer", "Rural artisan", "Construction worker", "Unorganized sector"]
        }
    },
    {
        "id": "ration-card",
        "name": "NFSA Ration Card",
        "department": "Department of Food and Public Distribution",
        "eligibility_desc": "Families living below state poverty limits (AAY and PHH categories)",
        "last_updated": "2026-04-10",
        "status": "Active",
        "benefits": ["Highly subsidized food grains: Rice at Rs. 3/kg, Wheat at Rs. 2/kg", "35kg food grains/family for AAY, 5kg/person for PHH"],
        "required_docs": ["Aadhaar Cards of all members", "Passport photo of Female Head", "Income Certificate", "Address Proof"],
        "rules": {
            "max_income": 100000
        }
    },
    {
        "id": "pm-awas",
        "name": "Pradhan Mantri Awas Yojana (PMAY-G)",
        "department": "Ministry of Rural Development",
        "eligibility_desc": "Homeless families, families living in kutcha/dilapidated houses",
        "last_updated": "2026-03-22",
        "status": "Active",
        "benefits": ["Financial assistance of Rs. 1,20,000 (plains) / Rs. 1,30,000 (hilly areas)", "Rs. 12,000 toilet construction assistance", "Interest subsidy on loans up to Rs. 70,000"],
        "required_docs": ["Aadhaar Card", "Bank details", "MGNREGA Job Card Number", "SBM Registration Number"],
        "rules": {
            "max_income": 150000,
            "requires_homeless_or_kutcha": "Yes"
        }
    },
    {
        "id": "e-shram",
        "name": "e-Shram Card Registration",
        "department": "Ministry of Labour and Employment",
        "eligibility_desc": "Unorganized workers aged 16-59, not members of EPFO/ESIC",
        "last_updated": "2026-06-01",
        "status": "Active",
        "benefits": ["Accidental insurance cover of Rs. 2 Lakhs on death/permanent disability", "Easy access to social security schemes"],
        "required_docs": ["Aadhaar Card", "Active Mobile Number", "Bank Account Details"],
        "rules": {
            "min_age": 16,
            "max_age": 59,
            "occupation_exclude": ["EPFO Member", "ESIC Member", "Organized Sector Worker"]
        }
    }
]

# Helper to get the best available generator model from local Ollama
def get_ollama_generator_model():
    try:
        r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=3)
        if r.status_code == 200:
            data = r.json()
            models = [m["name"] for m in data.get("models", [])]
            if "llama3:latest" in models or "llama3" in models:
                return "llama3"
            if "gemma4:latest" in models:
                return "gemma4:latest"
            if models:
                return models[0].split(":")[0]  # Use first model
    except Exception:
        pass
    return "gemma4:latest"  # Fallback

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/status', methods=['GET'])
def get_status():
    try:
        r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=3)
        if r.status_code == 200:
            data = r.json()
            models = [m["name"] for m in data.get("models", [])]
            return jsonify({
                "status": "online",
                "models": models,
                "preferred_generator": get_ollama_generator_model(),
                "preferred_embedding": "all-minilm"
            })
    except Exception as e:
        return jsonify({
            "status": "offline",
            "error": str(e),
            "info": "Ensure Ollama is running at http://localhost:11434 and 'gemma4:latest' is pulled."
        })

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    query = data.get("query", "").strip()
    session_id = data.get("session_id", "default_session")
    role = data.get("role", "citizen").lower() # citizen, officer, admin
    language = data.get("language", "English")

    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    # 1. RAG Semantic Search
    citations = []
    rag_context = ""
    try:
        hits = vector_store.similarity_search(query, k=3, model="all-minilm")
        if hits:
            # Filters hits based on relevance score (optional threshold)
            valid_hits = [h for h in hits if h["score"] > 0.15]
            if valid_hits:
                citations = [{"source": h["metadata"].get("source", "Unknown"), "text": h["text"], "score": h["score"], "title": h["metadata"].get("title", "Scheme File")} for h in valid_hits]
                rag_context = "\n\n".join([f"--- Chunk from {h['metadata'].get('source')} ---\n{h['text']}" for h in valid_hits])
    except Exception as e:
        logging.error(f"RAG search error: {e}")

    # 2. Manage Chat Memory
    if session_id not in session_memories:
        session_memories[session_id] = []
    
    # Keep history bounded to last 6 turns (12 items) to save prompt token count
    history = session_memories[session_id][-12:]

    # 3. Formulate LLM System Prompt
    system_instructions = (
        f"You are a professional, helpful, and official AI Government Services Assistant.\n"
        f"You are assisting a user in the role of: {role.upper()}.\n"
        f"The user prefers the response in: {language}.\n"
        f"Guidelines:\n"
        f"1. Answer user query politely and officially.\n"
        f"2. Use the retrieved context below to provide accurate, official information if relevant. If context is not available or insufficient, answer using generic knowledge, but explicitly state that you are using general information.\n"
        f"3. Never make up official policies or benefits. Cite scheme names clearly.\n"
        f"4. If answering in a language other than English (e.g. Hindi, Malayalam, Tamil), translate the text accurately while keeping scheme names readable."
    )

    if rag_context:
        system_instructions += f"\n\nRetrieved Official Context Documents:\n{rag_context}"

    # Build prompt structure
    # Since Ollama /api/generate doesn't natively take conversational objects (it takes simple prompt), 
    # we compile the history into a string prompt.
    compiled_prompt = f"System: {system_instructions}\n\n"
    for msg in history:
        compiled_prompt += f"{msg['role'].title()}: {msg['content']}\n"
    compiled_prompt += f"User: {query}\nAssistant:"

    # 4. Query Ollama
    gen_model = get_ollama_generator_model()
    try:
        r = requests.post(f"{OLLAMA_URL}/api/generate", json={
            "model": gen_model,
            "prompt": compiled_prompt,
            "stream": False
        }, timeout=45)

        if r.status_code == 200:
            llm_response = r.json().get("response", "").strip()
            # Update memory
            session_memories[session_id].append({"role": "user", "content": query})
            session_memories[session_id].append({"role": "assistant", "content": llm_response})
            
            return jsonify({
                "response": llm_response,
                "citations": citations,
                "simulated": False,
                "model": gen_model
            })
    except Exception as e:
        logging.error(f"Ollama generation failed: {e}")

    # 5. Simulated Mode Fallback
    logging.info("Falling back to simulated response generation.")
    sim_response = get_simulated_response(query, language)
    session_memories[session_id].append({"role": "user", "content": query})
    session_memories[session_id].append({"role": "assistant", "content": sim_response})
    
    return jsonify({
        "response": sim_response,
        "citations": [
            {
                "source": "simulated_database.txt",
                "text": "Fallback simulation engine utilized due to Ollama timeout or connection issues.",
                "title": "Local Mock DB",
                "score": 1.0
            }
        ] if "pm" in query.lower() or "scheme" in query.lower() else [],
        "simulated": True,
        "model": "simulation-engine"
    })

def get_simulated_response(query, language):
    q = query.lower()
    
    # Multilingual translation dictionary for responses
    translations = {
        "pm_kisan": {
            "English": "The PM-KISAN scheme offers Rs. 6,000 per year directly to eligible landholding farmers' bank accounts in three equal installments of Rs. 2,000. Institutional landholders and taxpayers are excluded. Visit pmkisan.gov.in to apply.",
            "Hindi": "पीएम-किसान योजना पात्र भूमिधारक किसानों के बैंक खातों में सीधे तीन समान किस्तों में ₹6,000 प्रति वर्ष की वित्तीय सहायता प्रदान करती है। संस्थागत भूमिधारक और करदाता इसमें शामिल नहीं हैं।",
            "Malayalam": "പിഎം-കിസാൻ പദ്ധതി പ്രകാരം അർഹരായ കർഷകർക്ക് പ്രതിവർഷം 6,000 രൂപ മൂന്ന് തുല്യ ഗഡുക്കളായി ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ട് ലഭിക്കുന്നു. നികുതിദായകർ ഇതിൽ നിന്ന് ഒഴിവാക്കപ്പെട്ടിരിക്കുന്നു.",
            "Tamil": "பிஎம்-கிசான் திட்டம் தகுதியுள்ள விவசாயிகளுக்கு ஆண்டுக்கு ₹6,000 நிதியுதவியை நேரடியாக வங்கி கணக்கில் செலுத்துகிறது. வருமான வரி செலுத்துபவர்களுக்கு இதில் விலக்கு அளிக்கப்பட்டுள்ளது."
        },
        "ayushman": {
            "English": "Ayushman Bharat (PM-JAY) provides a free health cover of Rs. 5 Lakhs per family per year for secondary and tertiary care hospitalizations. It applies to deprived families selected via the SECC 2011 index.",
            "Hindi": "आयुष्मान भारत (PM-JAY) परिवारों को माध्यमिक और तृतीयक देखभाल अस्पताल में भर्ती के लिए ₹5 लाख प्रति वर्ष का मुफ्त स्वास्थ्य बीमा प्रदान करता है।",
            "Malayalam": "ആയുഷ്മാൻ ഭാരത് പദ്ധതി വഴി ഒരു കുടുംബത്തിന് പ്രതിവർഷം 5 ലക്ഷം രൂപ വരെ സൗജന്യ ചികിത്സാ ആനുകൂല്യം ലഭിക്കുന്നു. ലിസ്റ്റിൽ ഉൾപ്പെട്ടിട്ടുള്ള ആശുപത്രികളിൽ ഈ സൗകര്യം ലഭ്യമാണ്.",
            "Tamil": "ஆயுஷ்மான் பாரத் திட்டம் தகுதியுள்ள குடும்பங்களுக்கு ஆண்டிற்கு ₹5 லட்சம் வரையிலான மருத்துவ காப்பீட்டை வழங்குகிறது."
        },
        "ration": {
            "English": "Ration cards provide subsidized food grains: Rice at Rs. 3/kg, Wheat at Rs. 2/kg under the NFSA. Documents required include Aadhaar copies, family income certificate, and a photo of the female head of household.",
            "Hindi": "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) के तहत राशन कार्ड रियायती खाद्य अनाज प्रदान करते हैं: चावल ₹3/किलो और गेहूं ₹2/किलो।",
            "Malayalam": "റേഷൻ കാർഡുകൾ വഴി സബ്സിഡി നിരക്കിൽ ഭക്ഷ്യധാന്യങ്ങൾ ലഭ്യമാണ്. അപേക്ഷിക്കാൻ ആധാർ കാർഡുകൾ, വരുമാന സർട്ടിഫിക്കറ്റ്, കുടുംബനാഥയുടെ ഫോട്ടോ എന്നിവ ആവശ്യമാണ്.",
            "Tamil": "ரேஷன் கார்டுகள் மூலம் மானிய விலையில் அரிசி மற்றும் கோதுமை வழங்கப்படுகிறது. குடும்பத் தலைவியின் புகைப்படம் மற்றும் ஆதார் அட்டை அപേക്ഷിക്കാൻ தேவை."
        },
        "default": {
            "English": "Thank you for asking about government services. I am here to help you check eligibility, gather application requirements, and find nearby CSC service centers. Please submit standard scheme names for detailed answers.",
            "Hindi": "सरकारी सेवाओं के बारे में पूछने के लिए धन्यवाद। मैं आपकी पात्रता की जांच करने और आवेदन आवश्यकताओं को खोजने में मदद कर सकता हूँ।",
            "Malayalam": "സർക്കാർ സേവനങ്ങളെക്കുറിച്ചുള്ള വിവരങ്ങൾക്ക് നന്ദി. യോഗ്യതകൾ പരിശോധിക്കാനും അപേക്ഷിക്കേണ്ട രീതികൾ മനസ്സിലാക്കാനും ഞാൻ നിങ്ങളെ സഹായിക്കാം.",
            "Tamil": "அரசு சேவைகள் பற்றிய கேள்விக்கு நன்றி. தகுதி விவரங்கள் மற்றும் விண்ணப்பிக்கும் முறைகளை அறிய நான் உங்களுக்கு உதவ முடியும்."
        }
    }

    lang = language if language in ["English", "Hindi", "Malayalam", "Tamil"] else "English"

    if "pm-kisan" in q or "kisan" in q or "farmer" in q:
        return translations["pm_kisan"][lang]
    elif "ayushman" in q or "health" in q or "bharat" in q or "hospital" in q:
        return translations["ayushman"][lang]
    elif "ration" in q or "food" in q or "rice" in q:
        return translations["ration"][lang]
    else:
        return translations["default"][lang]

@app.route('/api/eligibility', methods=['POST'])
def check_eligibility():
    data = request.json or {}
    age = int(data.get("age", 0))
    income = float(data.get("income", 0))
    occupation = data.get("occupation", "").strip()
    land = data.get("land", "No").strip()
    category = data.get("category", "General").strip()
    disability = data.get("disability", "No").strip()

    matches = []

    for s in SCHEMES_DATA:
        match_reasons = []
        mismatch_reasons = []
        score = 100
        rules = s.get("rules", {})

        # Age Check
        if "min_age" in rules:
            if age >= rules["min_age"]:
                match_reasons.append(f"Age meets the minimum requirement of {rules['min_age']}.")
            else:
                score -= 40
                mismatch_reasons.append(f"Requires minimum age of {rules['min_age']}. Current age is {age}.")
        if "max_age" in rules:
            if age <= rules["max_age"]:
                match_reasons.append(f"Age is within maximum limit of {rules['max_age']}.")
            else:
                score -= 40
                mismatch_reasons.append(f"Exceeds maximum age limit of {rules['max_age']}.")

        # Income Check
        if "max_income" in rules:
            if income <= rules["max_income"]:
                match_reasons.append(f"Annual Income of ₹{income:,} is below the threshold of ₹{rules['max_income']:,}.")
            else:
                diff = income - rules["max_income"]
                penalty = min(60, int((diff / rules["max_income"]) * 40))
                score -= penalty
                mismatch_reasons.append(f"Income of ₹{income:,} exceeds the maximum limit of ₹{rules['max_income']:,}.")

        # Land Ownership Check
        if "requires_land" in rules:
            if rules["requires_land"] == land:
                match_reasons.append("Land ownership criteria satisfied.")
            else:
                score -= 50
                mismatch_reasons.append("This scheme is only for landholding farmers. User reported no land ownership.")

        # Exclusion Checks
        if "occupation_exclude" in rules:
            if occupation in rules["occupation_exclude"]:
                score -= 60
                mismatch_reasons.append(f"Occupation '{occupation}' is in the exclusions category.")
            else:
                match_reasons.append(f"Occupation '{occupation}' is not excluded.")

        # Ensure score stays in 0-100 range
        score = max(0, score)

        matches.append({
            "id": s["id"],
            "name": s["name"],
            "department": s["department"],
            "match_percentage": score,
            "benefits": s["benefits"],
            "required_docs": s["required_docs"],
            "match_reasons": match_reasons,
            "mismatch_reasons": mismatch_reasons
        })

    # Sort matching schemes by percentage descending
    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    return jsonify({"eligible_schemes": matches})

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    q = request.args.get("q", "").strip().lower()
    department = request.args.get("department", "").strip().lower()
    status = request.args.get("status", "").strip().lower()
    sort_by = request.args.get("sort_by", "name").strip()
    
    # Filter
    filtered = SCHEMES_DATA.copy()
    if q:
        filtered = [s for s in filtered if q in s["name"].lower() or q in s["department"].lower() or q in s["eligibility_desc"].lower()]
    if department and department != "all":
        filtered = [s for s in filtered if department in s["department"].lower()]
    if status and status != "all":
        filtered = [s for s in filtered if status in s["status"].lower()]

    # Sort
    if sort_by == "name":
        filtered.sort(key=lambda x: x["name"])
    elif sort_by == "department":
        filtered.sort(key=lambda x: x["department"])
    elif sort_by == "status":
        filtered.sort(key=lambda x: x["status"])

    return jsonify({
        "schemes": filtered,
        "total": len(filtered)
    })

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file block in request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    
    if file and (file.filename.endswith('.pdf') or file.filename.endswith('.txt')):
        filename = secure_filename(file.filename)
        os.makedirs(DATA_DIR, exist_ok=True)
        filepath = os.path.join(DATA_DIR, filename)
        file.save(filepath)
        
        # Trigger re-ingestion
        try:
            ingest_documents(data_dir=DATA_DIR, index_path=INDEX_PATH, ollama_url=OLLAMA_URL)
            vector_store.load() # Reload index
            return jsonify({
                "success": True, 
                "filename": filename,
                "message": f"Successfully uploaded and ingested '{filename}'."
            })
        except Exception as e:
            return jsonify({
                "success": False, 
                "error": f"Uploaded successfully, but failed to ingest document: {e}"
            })
            
    return jsonify({"success": False, "error": "Allowed file types are PDF and TXT"}), 400

@app.route('/api/ingest', methods=['POST'])
def run_ingest():
    try:
        ingest_documents(data_dir=DATA_DIR, index_path=INDEX_PATH, ollama_url=OLLAMA_URL)
        vector_store.load()
        return jsonify({"success": True, "message": "Vector database re-ingested."})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/export', methods=['GET'])
def export_history():
    session_id = request.args.get("session_id", "default_session")
    history = session_memories.get(session_id, [])
    
    # Export as formatted text or JSON
    export_format = request.args.get("format", "json")
    if export_format == "txt":
        content = f"Official Government Services AI Assistant Chat Transcript\n"
        content += f"Session ID: {session_id}\n"
        content += f"===========================================================\n\n"
        for i, turn in enumerate(history):
            role = "USER" if turn["role"] == "user" else "AI ASSISTANT"
            content += f"[{role}]:\n{turn['content']}\n\n"
            content += f"-----------------------------------------------------------\n"
        return Response(
            content,
            mimetype="text/plain",
            headers={"Content-disposition": f"attachment; filename=chat_history_{session_id}.txt"}
        )
    else:
        return Response(
            json.dumps(history, indent=2, ensure_ascii=False),
            mimetype="application/json",
            headers={"Content-disposition": f"attachment; filename=chat_history_{session_id}.json"}
        )

if __name__ == '__main__':
    logging.info("Starting Government Services API Server...")
    app.run(host='0.0.0.0', port=5000, debug=True)
