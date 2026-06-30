const { useState, useEffect, useRef } = React;

// Inline SVG Icon Component to bypass external CDN network latency and maintain styling
function Icon({ name, className = "w-5 h-5", ...props }) {
  const icons = {
    dashboard: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    chat: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    schemes: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    eligibility: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tracker: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    nearby: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    documents: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    settings: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    user: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    bell: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    search: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    globe: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M11.02 18a8.003 8.003 0 117.962-7.962l-1.01 1.01a2 2 0 00-.59 1.404v1.207a2 2 0 01-.586 1.414l-1.01 1.01A2 2 0 0012 18h-1.02z" />
      </svg>
    ),
    sun: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 4.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
      </svg>
    ),
    moon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    mic: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    volume: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    ),
    upload: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    chevronRight: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    chevronDown: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    info: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    external: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    ),
    check: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    clock: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    plus: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    trash: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    download: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    logout: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    refresh: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H17.77" />
      </svg>
    )
  };
  return icons[name] || <span className="text-xs">?</span>;
}

const ROLE_TABS = {
  citizen: ["dashboard", "chat", "schemes", "eligibility", "tracker", "nearby"],
  officer: ["dashboard", "chat", "documents", "tracker"],
  admin: ["dashboard", "chat", "schemes", "documents"]
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [role, setRole] = useState(() => localStorage.getItem('role') || "citizen"); // citizen | officer | admin
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("dark");
  const [ollamaStatus, setOllamaStatus] = useState("checking"); // online | offline | checking
  const [preferredModel, setPreferredModel] = useState("gemma4:latest");
  
  // RAG / Chat States
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "ai",
      text: "Namaste! I am your AI Government Services assistant, connected to the National Public Digital Infrastructure RAG system.\n\nI can help you analyze eligibility requirements, navigate rules for central/state schemes, check required documentation, or find nearest Common Service Centers (CSC).\n\nWhat would you like to know today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      citations: []
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [sessionID] = useState(() => "session_" + Math.random().toString(36).substring(2, 9));
  
  // Speech API States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const speechUtteranceRef = useRef(null);

  // File Upload State
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Eligibility Form States
  const [eligibilityForm, setEligibilityForm] = useState({
    age: "28",
    state: "Kerala",
    occupation: "Farmer",
    income: "45000",
    category: "OBC",
    land: "Yes",
    disability: "No"
  });
  const [eligibilityResults, setEligibilityResults] = useState([]);
  const [calculatingEligibility, setCalculatingEligibility] = useState(false);

  // Application Tracker Database
  const [applications, setApplications] = useState([
    {
      id: "APP-827364",
      schemeName: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      citizenName: "Ramesh Kumar",
      dateApplied: "2026-06-25",
      status: "Approved",
      step: 3,
      timeline: [
        { label: "Submitted", date: "2026-06-25", status: "completed" },
        { label: "Land Record Verified", date: "2026-06-27", status: "completed" },
        { label: "Aadhaar e-KYC Verified", date: "2026-06-28", status: "completed" },
        { label: "Payment Released", date: "2026-06-29", status: "completed" }
      ]
    },
    {
      id: "APP-918234",
      schemeName: "Ayushman Bharat (PM-JAY)",
      citizenName: "Ramesh Kumar",
      dateApplied: "2026-06-28",
      status: "In Progress",
      step: 1,
      timeline: [
        { label: "Submitted", date: "2026-06-28", status: "completed" },
        { label: "Income Verification", date: "Pending", status: "active" },
        { label: "Card Generation", date: "Pending", status: "pending" }
      ]
    }
  ]);
  const [applyingScheme, setApplyingScheme] = useState(null);
  const [simulatedApplyStep, setSimulatedApplyStep] = useState(null); // 'auth' | 'verify' | 'submitted' | null

  // Schemes Explorer Search & Filters
  const [schemes, setSchemes] = useState([]);
  const [schemesSearch, setSchemesSearch] = useState("");
  const [schemesFilterDept, setSchemesFilterDept] = useState("all");
  const [schemesFilterStatus, setSchemesFilterStatus] = useState("all");
  const [schemesSortBy, setSchemesSortBy] = useState("name");

  // Map Locator States
  const [serviceCenters] = useState([
    { id: 1, name: "VLE CSC Digital Seva Kendra", type: "CSC Center", address: "Opp. Junction Market, Trivandrum, Kerala", distance: 1.2, phone: "+91 98472 82736" },
    { id: 2, name: "District Revenue Block Office", type: "District Office", address: "Collectorate Complex, Trivandrum, Kerala", distance: 3.5, phone: "+91 471 230 4567" },
    { id: 3, name: "State Agriculture Krishi Bhavan", type: "Government Office", address: "Vellayambalam Road, Trivandrum, Kerala", distance: 2.1, phone: "+91 471 272 1928" },
    { id: 4, name: "CSC Aadhaar Seva Kendra", type: "CSC Center", address: "MG Road Main Cross, Trivandrum, Kerala", distance: 4.0, phone: "+91 99461 88273" }
  ]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [calculatedDirections, setCalculatedDirections] = useState(null);

  // Global UI states
  const [globalSearch, setGlobalSearch] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, type: "success", text: "Application APP-827364 for PM-KISAN approved.", time: "10 mins ago" },
    { id: 2, type: "info", text: "New document 'national_farmers_policy_2026.pdf' ingested into RAG.", time: "2 hours ago" },
    { id: 3, type: "warning", text: "Annual income verification requested for Ayushman Bharat.", time: "1 day ago" }
  ]);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial Load
  useEffect(() => {
    checkServerStatus();
    loadSchemes();

    // Set up Web Speech API recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === "Hindi" ? "hi-IN" : language === "Malayalam" ? "ml-IN" : language === "Tamil" ? "ta-IN" : "en-IN";
      
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setChatInput(text);
        setIsListening(false);
      };
      
      rec.onerror = () => {
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = rec;
    }
  }, []);

  // Update voice language when language toggle occurs
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === "Hindi" ? "hi-IN" : language === "Malayalam" ? "ml-IN" : language === "Tamil" ? "ta-IN" : "en-IN";
    }
  }, [language]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const checkServerStatus = async () => {
    try {
      setOllamaStatus("checking");
      const r = await fetch("/api/status");
      if (r.ok) {
        const data = await r.json();
        setOllamaStatus(data.status);
        setPreferredModel(data.preferred_generator);
      } else {
        setOllamaStatus("offline");
      }
    } catch (err) {
      setOllamaStatus("offline");
    }
  };

  const loadSchemes = async () => {
    try {
      const r = await fetch(`/api/schemes?q=${schemesSearch}&department=${schemesFilterDept}&status=${schemesFilterStatus}&sort_by=${schemesSortBy}`);
      if (r.ok) {
        const data = await r.json();
        setSchemes(data.schemes);
      }
    } catch (err) {
      console.error("Error loading schemes:", err);
    }
  };

  // Trigger reloading schemes when filters modify
  useEffect(() => {
    loadSchemes();
  }, [schemesSearch, schemesFilterDept, schemesFilterStatus, schemesSortBy]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          session_id: sessionID,
          role: role,
          language: language
        })
      });

      if (r.ok) {
        const data = await r.json();
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          citations: data.citations || []
        };
        setMessages(prev => [...prev, aiMsg]);
        
        // Auto-read response if speech synthesis is desired
        if (isSpeaking) {
          speakText(data.response);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "⚠️ **System Communication Issue**: Unable to contact Flask API backend. Please ensure `python server.py` is running on port 5000.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Audio Speech Recognition (Voice-to-Text)
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition API is not supported in this browser. Please try Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Speech Synthesis (Text-to-Speech)
  const toggleSpeaking = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      // Read out the last AI message
      const aiMsgs = messages.filter(m => m.sender === "ai");
      if (aiMsgs.length > 0) {
        speakText(aiMsgs[aiMsgs.length - 1].text);
      }
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speech
    
    // Remove markdown symbols for cleaner speech
    const cleanText = text.replace(/[*#`_\-⚠️]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose appropriate voice/lang
    if (language === "Hindi") utterance.lang = "hi-IN";
    else if (language === "Malayalam") utterance.lang = "ml-IN";
    else if (language === "Tamil") utterance.lang = "ta-IN";
    else utterance.lang = "en-IN";
    
    utterance.onend = () => {
      // Speech finished
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // PDF Document Ingestion
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingFile(true);
    setUploadMessage({ type: "info", text: `Uploading and ingesting '${file.name}' into RAG...` });

    try {
      const r = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await r.json();
      
      if (r.ok && data.success) {
        setUploadMessage({ type: "success", text: `Successfully ingested '${file.name}'. The RAG pipeline index is updated!` });
        setNotifications(prev => [
          { id: Date.now(), type: "success", text: `RAG: Ingested '${file.name}' successfully.`, time: "Just now" },
          ...prev
        ]);
        // Trigger chat notification
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "ai",
            text: `📁 **Document Ingested**: I have successfully indexed the file **${file.name}** into the FAISS-simulation vector store using the **all-minilm** embeddings model. You can now ask questions specifically about this document!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      } else {
        setUploadMessage({ type: "error", text: data.error || "Upload failed." });
      }
    } catch (err) {
      setUploadMessage({ type: "error", text: "Backend server connection failed." });
    } finally {
      setUploadingFile(false);
      setTimeout(() => setUploadMessage(null), 8000);
    }
  };

  // Eligibility Evaluation Query
  const handleEligibilityFormChange = (e) => {
    const { name, value } = e.target;
    setEligibilityForm(prev => ({ ...prev, [name]: value }));
  };

  const runEligibilityQuery = async (formOverride) => {
    const form = formOverride || eligibilityForm;
    setCalculatingEligibility(true);
    setEligibilityResults([]);
    try {
      const r = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: form.age,
          income: form.income,
          occupation: form.occupation,
          land: form.land,
          category: form.category,
          disability: form.disability
        })
      });

      if (r.ok) {
        const data = await r.json();
        setEligibilityResults(data.eligible_schemes || []);
      } else {
        console.error("Eligibility API returned error:", r.status);
      }
    } catch (err) {
      console.error("Error computing eligibility:", err);
    } finally {
      setCalculatingEligibility(false);
    }
  };

  // Apply to a scheme micro-interaction loader
  const triggerApplyProcess = (scheme) => {
    setApplyingScheme(scheme);
    setSimulatedApplyStep("auth");
    
    setTimeout(() => {
      setSimulatedApplyStep("verify");
      setTimeout(() => {
        setSimulatedApplyStep("submitted");
        
        // Add new application to tracker list
        const appID = "APP-" + Math.floor(100000 + Math.random() * 900000);
        const newApp = {
          id: appID,
          schemeName: scheme.name,
          citizenName: "Ramesh Kumar",
          dateApplied: new Date().toISOString().split("T")[0],
          status: "In Progress",
          step: 1,
          timeline: [
            { label: "Submitted", date: new Date().toISOString().split("T")[0], status: "completed" },
            { label: "Internal Verification", date: "Pending", status: "active" },
            { label: "Approval Decision", date: "Pending", status: "pending" }
          ]
        };
        
        setApplications(prev => [newApp, ...prev]);
        setNotifications(prev => [
          { id: Date.now(), type: "info", text: `Submitted application ${appID} for ${scheme.name}.`, time: "Just now" },
          ...prev
        ]);

        setTimeout(() => {
          setApplyingScheme(null);
          setSimulatedApplyStep(null);
          // Redirect to tracker tab
          setActiveTab("tracker");
        }, 2000);

      }, 2000);
    }, 1800);
  };

  // Export Chat history as text or JSON file
  const handleExportHistory = (format) => {
    window.open(`/api/export?session_id=${sessionID}&format=${format}`, "_blank");
  };

  // Distance calculator and direction simulator
  const selectCenterForDirections = (center) => {
    setSelectedCenter(center);
    setCalculatedDirections([
      "Start from your current verified coordinates (Trivandrum GPS Office).",
      `Head North-West toward ${center.address.split(",")[0]}.`,
      `Turn right after 800 meters.`,
      `Pass beside the landmarks, reach destination at ${center.distance} km.`,
      `Office working hours: 10:00 AM - 5:00 PM.`
    ]);
  };

  // Starter Prompts for AI Chat
  const starterPrompts = [
    "Am I eligible for PM-KISAN?",
    "What documents are needed for Ayushman Bharat?",
    "How do I apply for a ration card?",
    "Which schemes are applicable for rural artisans?"
  ];

  return (
    <div className={`flex-1 flex flex-col md:flex-row h-screen overflow-hidden text-slate-100 ${theme === "dark" ? "bg-[#030812]" : "bg-slate-50 text-slate-900"}`}>
      
      {/* GLOW BACKGROUNDS */}
      <div className="glow-circle w-[500px] h-[500px] bg-teal-400/5 top-10 left-10"></div>
      <div className="glow-circle w-[600px] h-[600px] bg-blue-500/5 bottom-10 right-10"></div>

      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#081020]/95 border-r border-[#14d8c4]/15 flex flex-col z-20 relative backdrop-blur-md">
        
        {/* LOGO AREA */}
        <div className="p-5 border-b border-[#14d8c4]/15 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center font-bold text-lg text-[#030812] shadow-[0_0_15px_rgba(20,216,196,0.3)] font-outfit">
            GOV
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide text-white uppercase font-outfit">NDPI Portal</h2>
            <p className="text-[10px] text-teal-400 font-mono">Secure AI Services</p>
          </div>
        </div>

        {/* ROLE SELECTION PANELS - CITIZEN / OFFICER / ADMIN */}
        <div className="px-4 py-3 border-b border-[#14d8c4]/10 bg-[#0c1830]/40">
          <label className="text-[10px] uppercase font-bold tracking-wider text-teal-400/70 font-outfit block mb-2">User Access Role</label>
          <div className="grid grid-cols-3 gap-1 bg-[#030812]/80 p-1 rounded-lg border border-[#14d8c4]/10">
            {["citizen", "officer", "admin"].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`py-1 rounded text-[10px] font-semibold transition-all capitalize ${
                  role === r 
                    ? "bg-teal-400 text-navy-900 shadow-md font-bold" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* MENU NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["citizen", "officer", "admin"] },
            { id: "chat", label: "AI Chat Assistant", icon: "chat", roles: ["citizen", "officer", "admin"] },
            { id: "eligibility", label: "Eligibility Checker", icon: "eligibility", roles: ["citizen"] },
            { id: "schemes", label: "Government Schemes", icon: "schemes", roles: ["citizen", "officer", "admin"] },
            { id: "tracker", label: "Application Tracker", icon: "tracker", roles: ["citizen"] },
            { id: "nearby", label: "Service Centers", icon: "nearby", roles: ["citizen"] },
            { id: "documents", label: "Documents Hub", icon: "documents", roles: ["citizen", "officer"] }
          ].filter(item => item.roles.includes(role)).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeTab === item.id 
                  ? "sidebar-item-active text-teal-400 font-bold" 
                  : "text-gray-400 hover:bg-[#0c1830]/50 hover:text-white"
              }`}
            >
              <Icon name={item.icon} className="w-4.5 h-4.5" />
              <span>{item.label}</span>
              {item.id === "chat" && isTyping && (
                <span className="ml-auto w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>

        {/* STATUS FOOTER */}
        <div className="p-4 border-t border-[#14d8c4]/15 bg-[#030812]/50 text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-mono">Server Status:</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                ollamaStatus === "online" ? "bg-green-400 animate-pulse" : 
                ollamaStatus === "offline" ? "bg-red-500" : "bg-amber-400"
              }`}></span>
              <span className="text-[10px] font-mono text-gray-300 uppercase">{ollamaStatus}</span>
            </div>
          </div>
          <div className="text-[9px] text-gray-500 font-mono leading-relaxed truncate">
            Model: {preferredModel}
          </div>
        </div>

      </aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-[#14d8c4]/15 bg-[#081020]/90 backdrop-blur-md px-6 flex items-center justify-between">
          
          {/* SEARCH */}
          <div className="relative w-72 hidden sm:block">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Icon name="search" className="w-4 h-4 text-teal-400/60" />
            </span>
            <input
              type="text"
              placeholder="Search schemes, guides, rules..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setSchemesSearch(e.target.value);
                setActiveTab("schemes"); // Auto flip to schemes if searching globally
              }}
              className="w-full glass-input rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-gray-500"
            />
          </div>

          {/* RIGHT TOOLS */}
          <div className="flex items-center gap-4 ml-auto sm:ml-0">
            
            {/* LANGUAGE SELECTOR */}
            <div className="relative flex items-center gap-1 bg-[#0c1830] border border-[#14d8c4]/20 rounded-lg px-2.5 py-1">
              <Icon name="globe" className="w-3.5 h-3.5 text-teal-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs text-gray-200 font-bold focus:outline-none border-none cursor-pointer"
              >
                <option value="English">EN</option>
                <option value="Hindi">HI</option>
                <option value="Malayalam">ML</option>
                <option value="Tamil">TA</option>
              </select>
            </div>

            {/* NOTIFICATIONS BELL */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
                className="p-1.5 rounded-lg border border-[#14d8c4]/15 bg-[#0c1830] hover:bg-[#14d8c4]/10 transition-colors text-gray-300 relative focus:outline-none"
              >
                <Icon name="bell" className="w-4 h-4 text-teal-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-teal-400 text-[#030812] text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#030812]">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {showNotificationsDrawer && (
                <div className="absolute right-0 mt-3 w-80 glass-panel rounded-xl p-4 z-50 animate-slide-up">
                  <div className="flex items-center justify-between border-b border-[#14d8c4]/10 pb-2 mb-3">
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider font-outfit">Notifications Center</h3>
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-gray-500 hover:text-teal-400 font-mono"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-gray-500 py-4">No new alerts.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="border-b border-[#14d8c4]/5 last:border-0 pb-2.5 flex items-start gap-2.5 text-[11px]">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${n.type === "success" ? "bg-green-400" : n.type === "warning" ? "bg-amber-400" : "bg-teal-400"}`}></span>
                          <div>
                            <p className="text-gray-300 leading-normal">{n.text}</p>
                            <span className="text-[9px] text-gray-500 font-mono">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* THEME TOGGLE */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg border border-[#14d8c4]/15 bg-[#0c1830] text-gray-300 hover:bg-[#14d8c4]/10 transition-colors focus:outline-none"
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} className="w-4 h-4 text-teal-400" />
            </button>

            {/* USER PROFILE INFO */}
            <div className="flex items-center gap-2.5 border-l border-[#14d8c4]/20 pl-4">
              <div className="w-8 h-8 rounded-full bg-teal-400/20 border border-[#14d8c4]/30 flex items-center justify-center">
                <Icon name="user" className="w-4 h-4 text-teal-400" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white">Ramesh Kumar</p>
                <p className="text-[9px] text-gray-500 font-mono">UID: 8273-6491-0928</p>
              </div>
            </div>

          </div>

        </header>

        {/* CONTENT TABS */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 relative">
          
          {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* SECTION 1: OVERVIEW METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Government Schemes", count: "148+", icon: "schemes", change: "5 Added recently", desc: "Across 22 central ministries" },
                  { title: "Active Applications", count: applications.filter(a=>a.status==="In Progress").length, icon: "tracker", change: "Last update 2 hrs ago", desc: "Aadhaar verified processing" },
                  { title: "Eligibility Matches", count: eligibilityResults.filter(r=>r.match_percentage >= 70).length, icon: "eligibility", change: "Click to view matched list", desc: "Based on citizen parameters" },
                  { title: "Nearby Service Centers", count: serviceCenters.length, icon: "nearby", change: "Trivandrum boundary", desc: "CSC kiosks & Sub-dist offices" }
                ].map((c, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (idx === 1) setActiveTab("tracker");
                      if (idx === 2) setActiveTab("eligibility");
                      if (idx === 3) setActiveTab("nearby");
                    }}
                    className="glass-panel rounded-2xl p-5 relative overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400/5 rounded-full blur-xl group-hover:bg-teal-400/10 transition-all"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{c.title}</p>
                        <h3 className="text-3xl font-extrabold text-white mt-1.5 font-outfit tracking-tight">{c.count}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-inner">
                        <Icon name={c.icon} className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#14d8c4]/10 flex items-center justify-between text-[10px] font-sans">
                      <span className="text-teal-400 font-mono font-semibold">{c.change}</span>
                      <span className="text-gray-500">{c.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* DYNAMIC METRICS GRAPH & USER SPECIFIC ACTIVITIES */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Bar Chart using inline SVGs */}
                <div className="lg:col-span-8 glass-panel rounded-2xl p-6 flex flex-col">
                  <div className="flex justify-between items-center border-b border-[#14d8c4]/10 pb-4 mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white font-outfit">Citizen Application Submission Analytics</h3>
                      <p className="text-xs text-gray-500 font-sans mt-0.5">National level monthly portal submission metrics (2026)</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-teal-400/20 bg-teal-400/10 text-teal-400 rounded">
                      Live Database Feed
                    </span>
                  </div>
                  
                  {/* SVG Bar Graph */}
                  <div className="flex-1 min-h-[220px] flex items-end justify-between px-4 pb-2 relative">
                    {/* Y Axis Guides */}
                    <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between pointer-events-none pr-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-full border-t border-[#14d8c4]/5 h-0 relative">
                          <span className="absolute right-full mr-2 -top-2 text-[8px] font-mono text-gray-600">{(5 - i) * 250}k</span>
                        </div>
                      ))}
                    </div>

                    {/* Columns */}
                    {[
                      { month: "Jan", val: 55, count: "550k" },
                      { month: "Feb", val: 72, count: "720k" },
                      { month: "Mar", val: 64, count: "640k" },
                      { month: "Apr", val: 89, count: "890k" },
                      { month: "May", val: 95, count: "950k" },
                      { month: "Jun", val: 110, count: "1.1M" }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group z-10 relative" style={{ width: "12%" }}>
                        {/* Hover Popup */}
                        <div className="absolute bottom-full mb-1 bg-[#0c1830] border border-teal-400/40 px-2 py-1 rounded text-[9px] font-mono text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                          {bar.count} submissions
                        </div>
                        {/* Bar Shape */}
                        <div 
                          className="w-full rounded-t-lg bg-gradient-to-t from-teal-500/20 to-teal-400 border border-teal-400/30 group-hover:to-teal-300 group-hover:border-teal-300 transition-all duration-500" 
                          style={{ height: `${bar.val * 1.5}px` }}
                        ></div>
                        <span className="text-[10px] text-gray-400 font-bold mt-1 font-outfit">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feed Panel (Recent activity details) */}
                <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col">
                  <h3 className="text-base font-bold text-white font-outfit border-b border-[#14d8c4]/10 pb-4 mb-4">
                    Active Applications Log
                  </h3>
                  <div className="space-y-4 overflow-y-auto max-h-[250px] pr-1">
                    {applications.map(app => (
                      <div key={app.id} className="p-3 bg-[#0c1830]/40 border border-[#14d8c4]/10 rounded-xl flex flex-col gap-2 hover:border-[#14d8c4]/30 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-teal-400 font-semibold">{app.id}</span>
                          <span className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded ${
                            app.status === "Approved" ? "bg-green-400/10 border border-green-400/20 text-green-400" : "bg-amber-400/10 border border-amber-400/20 text-amber-400"
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-200 line-clamp-1">{app.schemeName}</p>
                          <p className="text-[9px] text-gray-500 mt-0.5">Applicant: {app.citizenName} • Applied on: {app.dateApplied}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ROLE BASED ANNOUNCEMENT SECTION */}
              <div className="glass-panel rounded-2xl p-5 border border-teal-400/25 bg-gradient-to-r from-teal-400/5 via-blue-500/5 to-transparent relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-400"></div>
                <div>
                  <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                    <span className="text-teal-400">📢</span> National Digital Public Infrastructure Update
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans mt-1">
                    Citizens are requested to link their Aadhaar cards with mobile numbers to process instant verification checks. Ingest system supports full PDF scan operations.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab("chat")} 
                  className="px-4 py-2 bg-teal-400 hover:bg-teal-400/90 text-navy-900 font-extrabold rounded-xl text-xs uppercase tracking-wider shrink-0 transition-colors shadow-[0_0_15px_rgba(20,216,196,0.25)] focus:outline-none"
                >
                  Consult AI Assistant
                </button>
                {/* Logout button */}
                <button 
                  onClick={() => { localStorage.removeItem('role'); window.location.href='login.html'; }}
                  className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs transition-colors"
                >
                  Logout
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: AI ASSISTANT CHAT VIEW */}
          {activeTab === "chat" && (
            <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in relative">
              
              {/* CHAT INTERFACE CONTAINER (MAIN) */}
              <div className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden shadow-2xl relative">
                
                {/* CHAT HEADER */}
                <div className="px-5 py-4 bg-[#081020]/90 border-b border-[#14d8c4]/15 flex justify-between items-center z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></div>
                    <div>
                      <h3 className="font-bold text-sm font-outfit text-white">Secure Digital Services AI Assistant</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${ollamaStatus === "online" ? "bg-green-400" : "bg-amber-400"}`}></span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {ollamaStatus === "online" ? `RAG Live Pipeline (${preferredModel})` : "Local Simulation Engines Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tools: Clear & Export */}
                  <div className="flex items-center gap-2">
                    {/* Format Selector Dropdown */}
                    <div className="flex items-center gap-1.5 bg-[#0c1830] border border-[#14d8c4]/15 rounded-lg px-2 py-1">
                      <Icon name="download" className="w-3.5 h-3.5 text-teal-400" />
                      <button 
                        onClick={() => handleExportHistory("json")} 
                        className="text-[9px] font-bold text-gray-300 hover:text-white"
                      >
                        JSON
                      </button>
                      <span className="text-[#14d8c4]/30">|</span>
                      <button 
                        onClick={() => handleExportHistory("txt")} 
                        className="text-[9px] font-bold text-gray-300 hover:text-white"
                      >
                        TXT
                      </button>
                    </div>

                    <button 
                      onClick={() => setMessages([
                        {
                          id: "welcome",
                          sender: "ai",
                          text: "Conversation history cleared. Ask me about other schemes, files, or eligibility conditions.",
                          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                          citations: []
                        }
                      ])}
                      title="Clear History"
                      className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-all focus:outline-none"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* MESSAGES LIST PANEL */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#030812]/15">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                      <div className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          msg.sender === "user" 
                            ? "bg-teal-400/10 border-teal-400/30 text-teal-400" 
                            : "bg-blue-500/10 border-blue-500/30 text-blue-500"
                        }`}>
                          <Icon name={msg.sender === "user" ? "user" : "chat"} className="w-4 h-4" />
                        </div>

                        {/* Bubble */}
                        <div 
                          className={`rounded-2xl px-4 py-3 text-sm shadow-md font-sans leading-relaxed relative ${
                            msg.sender === "user" 
                              ? "bg-teal-400 text-navy-900 rounded-tr-none font-medium" 
                              : "bg-[#0a1224]/90 border border-teal-400/10 text-gray-200 rounded-tl-none"
                          }`}
                        >
                          <div className="whitespace-pre-line text-[13px]">
                            {/* Format Bold Markdown tags inside text */}
                            {msg.text.split("\n").map((line, lIdx) => {
                              const boldRegex = /\*\*(.*?)\*\*/g;
                              const parts = [];
                              let lastIndex = 0;
                              let match;
                              while ((match = boldRegex.exec(line)) !== null) {
                                if (match.index > lastIndex) {
                                  parts.push(line.substring(lastIndex, match.index));
                                }
                                parts.push(<strong key={match.index} className={msg.sender === "user" ? "font-bold text-navy-900 underline" : "text-teal-400 font-bold"}>{match[1]}</strong>);
                                lastIndex = boldRegex.lastIndex;
                              }
                              if (lastIndex < line.length) {
                                parts.push(line.substring(lastIndex));
                              }
                              return (
                                <span key={lIdx}>
                                  {parts.length > 0 ? parts : line}
                                  <br />
                                </span>
                              );
                            })}
                          </div>

                          {/* CITATIONS CHIPS (IF ANY RETRIEVED FROM RAG) */}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-[#14d8c4]/10 flex flex-col gap-1.5">
                              <span className="text-[9px] uppercase tracking-wider font-bold text-teal-400/70 font-outfit">Verified Context Citations:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.citations.map((c, cIdx) => (
                                  <button
                                    key={cIdx}
                                    onClick={() => setSelectedCitation(c)}
                                    className="px-2.5 py-1 bg-teal-400/5 hover:bg-teal-400/10 border border-teal-400/15 text-teal-400 rounded-md text-[10px] font-mono flex items-center gap-1 transition-all focus:outline-none"
                                  >
                                    <span>📄</span>
                                    <span className="truncate max-w-[120px]">{c.title || c.source}</span>
                                    <span className="text-[8px] bg-teal-400/20 px-1 rounded font-bold">{Math.round(c.score * 100)}%</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <span className={`block text-[8px] mt-2 text-right ${msg.sender === "user" ? "text-navy-900/60" : "text-gray-500 font-mono"}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start animate-fadeIn">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-blue-500/10 border-blue-500/30 text-blue-500">
                          <Icon name="chat" className="w-4 h-4" />
                        </div>
                        <div className="bg-[#0a1224]/90 border border-teal-400/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* UPLOAD STATUS DRAWER */}
                {uploadMessage && (
                  <div className={`px-5 py-2.5 text-xs flex items-center justify-between border-t transition-all ${
                    uploadMessage.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                    uploadMessage.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                    "bg-teal-400/10 border-teal-400/20 text-teal-400"
                  }`}>
                    <span className="font-medium">{uploadMessage.text}</span>
                    <button onClick={() => setUploadMessage(null)} className="font-bold font-mono">×</button>
                  </div>
                )}

                {/* STARTER SUGGESTIONS */}
                <div className="px-4 py-2.5 bg-[#030812]/50 border-t border-[#14d8c4]/10 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
                  {starterPrompts.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="px-3 py-1.5 bg-[#0a1224] hover:bg-teal-400/5 border border-teal-400/15 text-teal-400 rounded-lg text-xs transition-colors shrink-0 font-sans focus:outline-none"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* CHAT INPUT AREA */}
                <div className="p-4 bg-[#081020]/90 border-t border-[#14d8c4]/15 flex items-center gap-2">
                  
                  {/* UPLOAD BUTTON */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.txt"
                    className="hidden"
                  />
                  <button
                    onClick={handleFileUploadClick}
                    disabled={uploadingFile}
                    title="Upload PDF or TXT to ingest into local RAG"
                    className="p-2.5 bg-[#0c1830] hover:bg-[#14d8c4]/10 border border-[#14d8c4]/15 text-teal-400 rounded-xl transition-all focus:outline-none"
                  >
                    <Icon name="upload" className="w-4.5 h-4.5" />
                  </button>

                  {/* MIC INPUT BUTTON (Speech to text) */}
                  <button
                    onClick={toggleListening}
                    title="Voice input"
                    className={`p-2.5 border rounded-xl transition-all focus:outline-none ${
                      isListening 
                        ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" 
                        : "bg-[#0c1830] hover:bg-[#14d8c4]/10 border-[#14d8c4]/15 text-teal-400"
                    }`}
                  >
                    {isListening ? (
                      <div className="voice-wave-container">
                        <span className="voice-wave-bar"></span>
                        <span className="voice-wave-bar"></span>
                        <span className="voice-wave-bar"></span>
                      </div>
                    ) : (
                      <Icon name="mic" className="w-4.5 h-4.5" />
                    )}
                  </button>

                  {/* INPUT TEXT */}
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatInput)}
                    placeholder="Ask about farm schemes, eligibility, health limits, or upload policy docs..."
                    className="flex-1 bg-[#030812]/80 border border-[#14d8c4]/20 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
                  />

                  {/* AUDIO PLAY BUTTON (Text to speech) */}
                  <button
                    onClick={toggleSpeaking}
                    title="Text-to-speech feedback"
                    className={`p-2.5 border rounded-xl transition-all focus:outline-none ${
                      isSpeaking 
                        ? "bg-teal-400/20 border-teal-400 text-teal-400" 
                        : "bg-[#0c1830] hover:bg-[#14d8c4]/10 border-[#14d8c4]/15 text-teal-400"
                    }`}
                  >
                    <Icon name="volume" className="w-4.5 h-4.5" />
                  </button>

                  {/* SEND BUTTON */}
                  <button
                    onClick={() => handleSendMessage(chatInput)}
                    className="px-5 py-3 bg-teal-400 hover:bg-teal-400/90 text-navy-900 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,216,196,0.2)] focus:outline-none"
                  >
                    <span>Send</span>
                    <span className="text-[10px]">➔</span>
                  </button>

                </div>

              </div>

              {/* CITATIONS SIDEBAR PANEL (SLIDE OUT DETAILS) */}
              {selectedCitation && (
                <div className="w-full lg:w-80 glass-panel rounded-2xl p-5 flex flex-col z-10 animate-slide-up h-full absolute lg:relative top-0 right-0">
                  <div className="flex justify-between items-center border-b border-[#14d8c4]/10 pb-3 mb-4">
                    <h4 className="font-bold text-xs text-white font-outfit uppercase tracking-wider">Citation Context Explorer</h4>
                    <button 
                      onClick={() => setSelectedCitation(null)}
                      className="text-gray-500 hover:text-white text-lg font-mono focus:outline-none"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 text-xs space-y-4">
                    <div className="bg-[#0c1830] p-3 rounded-lg border border-teal-400/10">
                      <p className="text-[10px] text-teal-400 font-bold uppercase font-outfit">Source Document</p>
                      <p className="text-white font-bold mt-1 line-clamp-1">{selectedCitation.title}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.5">Filename: {selectedCitation.source}</p>
                    </div>
                    <div className="bg-[#0c1830] p-3 rounded-lg border border-teal-400/10">
                      <p className="text-[10px] text-teal-400 font-bold uppercase font-outfit">Retrieval Confidence</p>
                      <p className="text-white font-bold mt-1 font-mono">{Math.round(selectedCitation.score * 100)}% match score</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-teal-400 font-bold uppercase font-outfit">Retrieved Segment Text</p>
                      <p className="text-gray-300 leading-relaxed font-mono p-2.5 bg-[#030812] border border-[#14d8c4]/5 rounded-lg whitespace-pre-line text-[11px]">
                        {selectedCitation.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: ELIGIBILITY CHECKER */}
          {activeTab === "eligibility" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              
              {/* SECTION A: THE PARAMETER FORM */}
              <div className="lg:col-span-4 glass-panel rounded-2xl p-6 h-fit">
                <h3 className="text-base font-bold text-white font-outfit border-b border-[#14d8c4]/10 pb-4 mb-4">
                  Citizen Parameters
                </h3>
                
                <div className="space-y-4 font-sans text-xs">
                  
                  {/* Age */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-300 font-medium">Age (Years)</label>
                    <input 
                      type="number" 
                      name="age"
                      value={eligibilityForm.age}
                      onChange={handleEligibilityFormChange}
                      className="glass-input rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-300 font-medium">Resident State</label>
                    <select
                      name="state"
                      value={eligibilityForm.state}
                      onChange={handleEligibilityFormChange}
                      className="glass-input rounded-lg px-3 py-2 text-white bg-[#0a1224]"
                    >
                      {["Kerala", "Tamil Nadu", "Karnataka", "Uttar Pradesh", "Maharashtra", "Bihar"].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Occupation */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-300 font-medium">Occupation Type</label>
                    <select
                      name="occupation"
                      value={eligibilityForm.occupation}
                      onChange={handleEligibilityFormChange}
                      className="glass-input rounded-lg px-3 py-2 text-white bg-[#0a1224]"
                    >
                      {["Farmer", "Manual laborer", "Rural artisan", "Construction worker", "Government Employee", "Unorganized Sector Worker"].map(occ => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                  </div>

                  {/* Income */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-300 font-medium">Annual Income (INR ₹)</label>
                    <input 
                      type="number" 
                      name="income"
                      value={eligibilityForm.income}
                      onChange={handleEligibilityFormChange}
                      className="glass-input rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-300 font-medium">Social Category</label>
                    <select
                      name="category"
                      value={eligibilityForm.category}
                      onChange={handleEligibilityFormChange}
                      className="glass-input rounded-lg px-3 py-2 text-white bg-[#0a1224]"
                    >
                      {["General", "OBC", "SC", "ST", "Institutional Landholder"].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Land Ownership */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-300 font-medium">Cultivable Land Ownership</label>
                    <div className="flex gap-4">
                      {["Yes", "No"].map(l => (
                        <label key={l} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                          <input 
                            type="radio" 
                            name="land"
                            value={l}
                            checked={eligibilityForm.land === l}
                            onChange={handleEligibilityFormChange}
                            className="text-teal-400 focus:ring-0"
                          />
                          <span>{l}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Disability */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-300 font-medium">Disability Status</label>
                    <div className="flex gap-4">
                      {["Yes", "No"].map(d => (
                        <label key={d} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                          <input 
                            type="radio" 
                            name="disability"
                            value={d}
                            checked={eligibilityForm.disability === d}
                            onChange={handleEligibilityFormChange}
                            className="text-teal-400 focus:ring-0"
                          />
                          <span>{d}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={() => runEligibilityQuery(eligibilityForm)}
                    disabled={calculatingEligibility}
                    className="w-full mt-2 py-3 bg-teal-400 hover:bg-teal-400/90 text-navy-900 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(20,216,196,0.25)] focus:outline-none"
                  >
                    {calculatingEligibility ? "Calculating Matches..." : "Compute Match Percentage"}
                  </button>

                </div>

              </div>

              {/* SECTION B: TARGET RESULTS */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* APPLICATION MICRO-LOADER OVERLAY */}
                {applyingScheme && (
                  <div className="glass-panel border-teal-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 z-40 bg-[#030812]/95 border">
                    <div className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin"></div>
                    <h3 className="text-base font-bold text-white font-outfit">
                      {simulatedApplyStep === "auth" ? "Aadhaar authentication request initiated..." : 
                       simulatedApplyStep === "verify" ? "Verifying local revenue land database..." :
                       "Submitting scheme application record..."}
                    </h3>
                    <p className="text-xs text-gray-400 max-w-sm">
                      Secure verification via National Digital Public Infrastructure sandbox layer.
                    </p>
                  </div>
                )}

                {!applyingScheme && (
                  <>
                    <div className="flex justify-between items-center pb-2">
                      <h3 className="text-base font-bold text-white font-outfit">Eligible Government Schemes Match Outcomes</h3>
                      <span className="text-[10px] text-teal-400 font-mono">Sorted by match percent</span>
                    </div>

                    {eligibilityResults.length === 0 ? (
                      <div className="glass-panel rounded-2xl p-12 text-center text-gray-500">
                        No matches computed. Complete parameters and submit.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {eligibilityResults.map((match) => (
                          <div 
                            key={match.id} 
                            className={`glass-panel rounded-2xl p-5 border relative ${
                              match.match_percentage >= 70 ? "border-[#14d8c4]/30" : "border-slate-800"
                            }`}
                          >
                            {/* Match Percent Badge */}
                            <div className="absolute top-5 right-5 flex flex-col items-end">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                                match.match_percentage >= 80 ? "bg-green-400/10 text-green-400 border border-green-400/25" :
                                match.match_percentage >= 50 ? "bg-amber-400/10 text-amber-400 border border-amber-400/25" :
                                "bg-red-400/10 text-red-400 border border-red-400/25"
                              }`}>
                                {match.match_percentage}% Match
                              </span>
                            </div>

                            {/* Header */}
                            <div className="pr-24">
                              <h4 className="font-bold text-sm text-white font-outfit">{match.name}</h4>
                              <p className="text-[10px] text-gray-400 mt-1 font-mono">Ministry/Department: {match.department}</p>
                            </div>

                            {/* Benefits & Documents Split */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#14d8c4]/10 text-[11px]">
                              
                              {/* Benefits */}
                              <div>
                                <p className="font-bold text-teal-400 mb-1.5 font-outfit uppercase tracking-wider text-[9px]">Key Benefits</p>
                                <ul className="space-y-1 text-gray-300">
                                  {match.benefits.map((b, bIdx) => (
                                    <li key={bIdx} className="flex items-start gap-1.5">
                                      <span className="text-teal-400 font-bold">✓</span>
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Documents */}
                              <div>
                                <p className="font-bold text-teal-400 mb-1.5 font-outfit uppercase tracking-wider text-[9px]">Required Documents</p>
                                <ul className="space-y-1 text-gray-300">
                                  {match.required_docs.map((d, dIdx) => (
                                    <li key={dIdx} className="flex items-start gap-1.5">
                                      <span className="text-teal-400 font-bold">▪</span>
                                      <span>{d}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                            </div>

                            {/* Decision Rules list (match vs mismatch details) */}
                            {match.mismatch_reasons.length > 0 && (
                              <div className="mt-3 p-2.5 bg-red-500/5 border border-red-500/10 rounded-lg text-[10px] text-red-400 font-sans">
                                <strong>Mismatched Rules:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                  {match.mismatch_reasons.map((mr, mrIdx) => <li key={mrIdx}>{mr}</li>)}
                                </ul>
                              </div>
                            )}

                            {/* Apply Button */}
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => triggerApplyProcess(match)}
                                disabled={match.match_percentage < 70}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide focus:outline-none ${
                                  match.match_percentage >= 70 
                                    ? "bg-teal-400 hover:bg-teal-400/90 text-navy-900 shadow-md" 
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                }`}
                              >
                                {match.match_percentage >= 70 ? "Apply Online Now" : "Ineligible (Match < 70%)"}
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

              </div>

            </div>
          )}

          {/* TAB 4: SCHEMES EXPLORER TABLE */}
          {activeTab === "schemes" && (
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6 animate-fade-in">
              
              {/* FILTER BAR */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#14d8c4]/15 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit">NDPI Unified Schemes Repository</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Central Database search repository</p>
                </div>
                
                {/* Inputs */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search input */}
                  <input
                    type="text"
                    value={schemesSearch}
                    onChange={(e) => setSchemesSearch(e.target.value)}
                    placeholder="Search schemes name..."
                    className="glass-input rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500"
                  />
                  {/* Dropdowns */}
                  <select
                    value={schemesFilterDept}
                    onChange={(e) => setSchemesFilterDept(e.target.value)}
                    className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-white bg-[#0c1830] select-none"
                  >
                    <option value="all">All Departments</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="health">Health Authority</option>
                    <option value="rural">Rural Development</option>
                    <option value="labour">Labour & Employment</option>
                  </select>
                  
                  <select
                    value={schemesSortBy}
                    onChange={(e) => setSchemesSortBy(e.target.value)}
                    className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-white bg-[#0c1830] select-none"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="department">Sort by Department</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>
              </div>

              {/* TABLE DATA GRID */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#14d8c4]/15 text-teal-400 font-bold uppercase tracking-wider text-[10px] font-outfit">
                      <th className="py-3.5 px-4">Scheme Name</th>
                      <th className="py-3.5 px-4">Ministry / Department</th>
                      <th className="py-3.5 px-4">Eligibility Overview</th>
                      <th className="py-3.5 px-4">Last Updated</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500 font-sans">
                          No matching schemes found. Adjust search terms.
                        </td>
                      </tr>
                    ) : (
                      schemes.map((s) => (
                        <tr key={s.id} className="border-b border-slate-900 hover:bg-[#0c1830]/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white font-outfit">{s.name}</td>
                          <td className="py-3.5 px-4 text-gray-300">{s.department}</td>
                          <td className="py-3.5 px-4 text-gray-400 italic font-sans">{s.eligibility_desc}</td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500">{s.last_updated}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-green-400/10 border border-green-400/25 text-green-400">
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => {
                                setEligibilityForm(prev => ({
                                  ...prev,
                                  land: s.id === "pm-kisan" ? "Yes" : "No",
                                  occupation: s.id === "pm-kisan" ? "Farmer" : s.id === "e-shram" ? "Unorganized Sector Worker" : "Manual laborer"
                                }));
                                setActiveTab("eligibility");
                              }}
                              className="px-2.5 py-1 bg-teal-400/10 hover:bg-teal-400 text-teal-400 hover:text-navy-900 border border-teal-400/30 rounded-lg text-[10px] font-semibold transition-all focus:outline-none"
                            >
                              Verify Eligibility
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 5: APPLICATION TRACKER */}
          {activeTab === "tracker" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit">Citizen Application Tracking Centre</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Track real-time progress of submitted digital applications</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {applications.map(app => (
                  <div key={app.id} className="glass-panel rounded-2xl p-6 flex flex-col gap-4 relative">
                    
                    {/* Header bar */}
                    <div className="flex justify-between items-start border-b border-[#14d8c4]/10 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-400/5 px-2 py-1 rounded border border-teal-400/15">
                          ID: {app.id}
                        </span>
                        <h4 className="font-bold text-sm text-white font-outfit mt-2">{app.schemeName}</h4>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${
                        app.status === "Approved" ? "bg-green-400/15 text-green-400 border border-green-400/25" : "bg-amber-400/15 text-amber-400 border border-amber-400/25"
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    {/* Timeline stepper */}
                    <div className="space-y-4">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-teal-400/70 font-outfit">Processing Steps Log</p>
                      
                      <div className="relative pl-6 space-y-4">
                        {/* Timeline Bar */}
                        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-800"></div>

                        {app.timeline.map((t, idx) => (
                          <div key={idx} className="relative flex justify-between text-xs">
                            {/* Dot icon */}
                            <span className={`absolute -left-5 w-4 h-4 rounded-full border-2 flex items-center justify-center z-10 ${
                              t.status === "completed" ? "bg-teal-400 border-[#030812] text-navy-900 text-[8px] font-bold" :
                              t.status === "active" ? "bg-[#030812] border-teal-400 animate-pulse text-[8px] text-teal-400" :
                              "bg-[#030812] border-slate-800 text-[8px] text-gray-700"
                            }`}>
                              {t.status === "completed" ? "✓" : "▪"}
                            </span>
                            <div>
                              <p className={`font-bold ${t.status === "completed" ? "text-gray-200" : t.status === "active" ? "text-teal-400 font-extrabold" : "text-gray-600"}`}>
                                {t.label}
                              </p>
                              <p className="text-[10px] text-gray-500 mt-0.5">{t.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 6: SERVICE CENTERS MAP LOCATOR */}
          {activeTab === "nearby" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              
              {/* LIST OF CENTERS */}
              <div className="lg:col-span-5 glass-panel rounded-2xl p-5 flex flex-col h-[520px] overflow-hidden">
                <div className="border-b border-[#14d8c4]/10 pb-3 mb-4">
                  <h3 className="text-base font-bold text-white font-outfit">Service Center Directory</h3>
                  <p className="text-xs text-gray-500 mt-0.5">CSC digital counters near Trivandrum</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {serviceCenters.map(center => (
                    <div 
                      key={center.id} 
                      onClick={() => selectCenterForDirections(center)}
                      className={`p-3.5 border rounded-xl flex flex-col gap-1.5 cursor-pointer transition-all ${
                        selectedCenter?.id === center.id 
                          ? "bg-teal-400/5 border-teal-400" 
                          : "bg-[#0c1830]/40 border-slate-800 hover:border-teal-400/30"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-white font-outfit">{center.name}</h4>
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#0c1830] border border-teal-400/20 text-teal-400 rounded-md font-mono">
                          {center.distance} km
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-sans">{center.address}</p>
                      <p className="text-[9px] text-gray-500 font-mono">Contact: {center.phone}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* GOOGLE MAPS PANEL */}
              <div className="lg:col-span-7 flex flex-col gap-4">

                {/* Embedded Google Map centred on Trivandrum */}
                <div className="glass-panel rounded-2xl overflow-hidden border border-[#14d8c4]/20 card-glow" style={{ height: "340px" }}>
                  <iframe
                    title="Service Centers Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={selectedCenter
                      ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder-key&q=${encodeURIComponent(selectedCenter.address)}&zoom=15`
                      : `https://www.google.com/maps/embed/v1/search?key=AIzaSyD-placeholder-key&q=government+service+centre+near+Trivandrum+Kerala&zoom=13`
                    }
                  />
                </div>

                {/* Selected Center Detail + Directions Button */}
                {selectedCenter && (
                  <div className="glass-panel rounded-2xl p-5 border border-teal-400/25 bg-teal-400/5 animate-slide-up text-xs font-sans">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-white font-outfit text-[13px] flex items-center gap-1.5">
                          <span>🏢</span> {selectedCenter.name}
                        </h4>
                        <p className="text-gray-400 mt-1 font-sans">{selectedCenter.address}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-mono">📞 {selectedCenter.phone} &nbsp;•&nbsp; 📏 {selectedCenter.distance} km away</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedCenter.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-4 py-2 bg-teal-400 hover:bg-teal-300 text-navy-900 font-extrabold rounded-xl text-[11px] uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(20,216,196,0.25)] flex items-center gap-1.5"
                      >
                        <span>🗺️</span> Get Directions
                      </a>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 7: DOCUMENTS HUB */}
          {activeTab === "documents" && (
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl p-6 space-y-6 animate-fade-in text-xs font-sans">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#14d8c4]/15 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit">Citizen Documents Safe</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Secure sandbox documents storage for scheme verification checks</p>
                </div>
                <button 
                  onClick={handleFileUploadClick}
                  className="px-4 py-2 bg-teal-400 hover:bg-teal-400/90 text-navy-900 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,216,196,0.25)] focus:outline-none"
                >
                  <Icon name="plus" className="w-4 h-4" />
                  <span>Upload New Document</span>
                </button>
              </div>

              {/* Ingest status grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "aadhaar_card_verified.pdf", size: "284 kB", status: "Verified", type: "pdf", icon: "documents", desc: "Linked with demographic databases" },
                  { name: "land_registry_patta.pdf", size: "1.4 MB", status: "Verified", type: "pdf", icon: "documents", desc: "Verifiable khatauni/registry ledger" },
                  { name: "income_affidavit_2026.txt", size: "4 kB", status: "Processing", type: "txt", icon: "documents", desc: "Submitted under block revenue officer audit" },
                  { name: "pm_kisan_guide.pdf", size: "1.2 MB", status: "Ingested", type: "pdf", icon: "documents", desc: "Ingested into local RAG Assistant" }
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 bg-[#0c1830]/40 border border-[#14d8c4]/10 rounded-xl flex items-start gap-3.5 hover:border-teal-400/30 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-400">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{doc.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{doc.size} • {doc.desc}</p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase ${
                          doc.status === "Verified" ? "bg-green-400/10 border border-green-400/20 text-green-400" :
                          doc.status === "Ingested" ? "bg-teal-400/10 border border-teal-400/20 text-teal-400" :
                          "bg-amber-400/10 border border-amber-400/20 text-amber-400 animate-pulse"
                        }`}>
                          {doc.status}
                        </span>
                        <a 
                          href="#"
                          onClick={(e) => e.preventDefault()} 
                          className="text-teal-400 hover:underline text-[10px] font-bold"
                        >
                          View Document
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Settings Manager removed as per user request */}

        </main>

        {/* SECURE SUB-FOOTER */}
        <footer className="h-10 px-6 border-t border-[#14d8c4]/15 bg-[#081020]/95 flex justify-between items-center text-[10px] text-gray-500 font-mono z-10">
          <span>© 2026 National Digital Public Infrastructure (NDPI). All rights reserved.</span>
          <span>Verified Security Audit: Level-1 Sandbox Active</span>
        </footer>

      </div>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
