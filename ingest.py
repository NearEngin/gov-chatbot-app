import os
import glob
from pypdf import PdfReader
from vector_store import OllamaVectorStore

# Predefined sample schemes to generate default files for out-of-the-box demonstration
DEFAULT_SCHEMES = {
    "pm_kisan.txt": """
Scheme Name: PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)
Department: Department of Agriculture and Farmers Welfare
Eligibility Criteria:
- Land Ownership: All landholding farmers' families who own cultivable land in their names.
- Age: 18 years and above.
- Exclusions: Institutional landholders, serving/retired government employees, income taxpayers, and individuals receiving pension > Rs. 10,000/month.
Benefits:
- Financial assistance of Rs. 6,000 per year, payable in three equal installments of Rs. 2,000 every four months.
- Direct Benefit Transfer (DBT) straight to the farmer's bank account.
Required Documents:
- Aadhaar Card
- Land registry documents (Khatauni/Patta)
- Citizenship certificate
- Bank Account Passbook
- Mobile number linked with Aadhaar
Last Updated: June 15, 2026
Status: Active
""",
    "ayushman_bharat.txt": """
Scheme Name: Ayushman Bharat (Pradhan Mantri Jan Arogya Yojana - PM-JAY)
Department: National Health Authority, Ministry of Health and Family Welfare
Eligibility Criteria:
- Income/Category: Identified based on deprivation criteria in the Socio-Economic Caste Census (SECC 2011).
- Household Type: Families living in one-room houses with kucha walls, landless households deriving major income from manual labor, female-headed households with no adult male member.
- Exclusions: Families owning motorized vehicles, landlines, or earning > Rs. 10,000/month, or tax paying families.
Benefits:
- Health insurance cover of up to Rs. 5 Lakhs per family per year for secondary and tertiary hospitalization.
- Cashless and paperless treatment at all empaneled public and private hospitals.
Required Documents:
- Aadhaar Card / Ration Card
- PM-JAY Family ID card or letter
- Income Certificate
- Caste Certificate (if applicable)
Last Updated: May 20, 2026
Status: Active
""",
    "ration_card.txt": """
Scheme Name: NFSA Ration Card (National Food Security Act)
Department: Department of Food and Public Distribution
Eligibility Criteria:
- Income Limit: Varies by state, typically annual income less than Rs. 1,00,000 for Priority Households.
- Category: Antyodaya Anna Yojana (AAY) for poorest of the poor families, and Priority Households (PHH) determined by state guidelines.
Benefits:
- Rice at Rs. 3/kg, Wheat at Rs. 2/kg, and Coarse grains at Rs. 1/kg.
- Monthly allowance of 35kg food grains per family for AAY, and 5kg food grains per person for PHH.
Required Documents:
- Aadhaar Cards of all family members
- Photograph of the Head of the Family (eldest female)
- Income Certificate
- Proof of Address (Electricity bill/Gas card)
- Bank Account Passbook
Last Updated: April 10, 2026
Status: Active
""",
    "pm_awas_yojana.txt": """
Scheme Name: Pradhan Mantri Awas Yojana - Gramin (PMAY-G)
Department: Ministry of Rural Development
Eligibility Criteria:
- Housing Status: Homeless families, families living in houses with zero, one, or two rooms with kutcha walls and roof.
- Income/Category: Low-income families, SC/ST, manual scavengers, freed bonded laborers.
Benefits:
- Financial assistance of Rs. 1,20,000 in plains and Rs. 1,30,000 in hilly areas/difficult areas for house construction.
- Additional Rs. 12,000 assistance for toilet construction under Swachh Bharat Mission.
- Optional bank loan up to Rs. 70,000 at interest subsidy.
Required Documents:
- Aadhaar Card
- Bank Account details
- Job Card number (MGNREGA)
- Swachh Bharat Mission (SBM) registration number
- Consent to use Aadhaar on behalf of beneficiary
Last Updated: March 22, 2026
Status: Active
"""
}

def create_default_data(data_dir="./data"):
    os.makedirs(data_dir, exist_ok=True)
    for filename, content in DEFAULT_SCHEMES.items():
        filepath = os.path.join(data_dir, filename)
        if not os.path.exists(filepath):
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content.strip())
            print(f"Created default document: {filepath}")

def chunk_text(text, chunk_size=500, chunk_overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - chunk_overlap
    return chunks

def ingest_documents(data_dir="./data", index_path="vector_index.json", ollama_url="http://localhost:11434"):
    create_default_data(data_dir)
    vector_store = OllamaVectorStore(index_path=index_path, ollama_url=ollama_url)
    
    # Check if there's an existing index
    vector_store.load()
    
    txt_files = glob.glob(os.path.join(data_dir, "*.txt"))
    pdf_files = glob.glob(os.path.join(data_dir, "*.pdf"))
    
    all_files = txt_files + pdf_files
    print(f"Found {len(all_files)} files to ingest ({len(txt_files)} TXT, {len(pdf_files)} PDF).")
    
    indexed_files = {doc["metadata"].get("source") for doc in vector_store.documents}
    
    new_chunks_added = 0
    
    for filepath in all_files:
        filename = os.path.basename(filepath)
        
        # Check if already indexed
        if filename in indexed_files:
            print(f"Skipping {filename} (already indexed).")
            continue
            
        print(f"Processing {filename}...")
        
        text = ""
        if filepath.endswith(".txt"):
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    text = f.read()
            except Exception as e:
                print(f"Error reading TXT {filepath}: {e}")
                continue
        elif filepath.endswith(".pdf"):
            try:
                reader = PdfReader(filepath)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            except Exception as e:
                print(f"Error reading PDF {filepath}: {e}")
                continue
                
        if not text.strip():
            print(f"Warning: No text extracted from {filename}")
            continue
            
        chunks = chunk_text(text)
        print(f"Chunked {filename} into {len(chunks)} segments. Generating embeddings...")
        
        for idx, chunk in enumerate(chunks):
            metadata = {
                "source": filename,
                "chunk_index": idx,
                "type": "pdf" if filepath.endswith(".pdf") else "txt"
            }
            # Extract scheme title if possible
            for line in chunk.split("\n"):
                if "Scheme Name:" in line:
                    metadata["title"] = line.split("Scheme Name:")[1].strip()
                    break
            if "title" not in metadata:
                metadata["title"] = filename.replace(".txt", "").replace(".pdf", "").replace("_", " ").title()
                
            vector_store.add_document(chunk, metadata)
            new_chunks_added += 1
            
    if new_chunks_added > 0:
        vector_store.save()
        print(f"Ingestion complete. Added {new_chunks_added} new chunks to the vector database.")
    else:
        print("No new documents to ingest. Vector database is up-to-date.")

if __name__ == "__main__":
    ingest_documents()
