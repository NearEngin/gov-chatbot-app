import os
import json
import numpy as np
import requests

class OllamaVectorStore:
    def __init__(self, index_path="vector_index.json", ollama_url="http://localhost:11434"):
        self.index_path = index_path
        self.ollama_url = ollama_url
        self.documents = []  # List of dicts: {"id": ID, "text": text, "metadata": metadata, "embedding": list}

    def load(self):
        if os.path.exists(self.index_path):
            try:
                with open(self.index_path, 'r', encoding='utf-8') as f:
                    self.documents = json.load(f)
                print(f"Loaded {len(self.documents)} chunks from index.")
                return True
            except Exception as e:
                print(f"Error loading index: {e}")
                self.documents = []
        else:
            self.documents = []
        return False

    def save(self):
        try:
            # Ensure parent directories exist
            os.makedirs(os.path.dirname(os.path.abspath(self.index_path)), exist_ok=True)
            with open(self.index_path, 'w', encoding='utf-8') as f:
                json.dump(self.documents, f, ensure_ascii=False, indent=2)
            print(f"Saved {len(self.documents)} chunks to index.")
            return True
        except Exception as e:
            print(f"Error saving index: {e}")
            return False

    def get_embedding(self, text, model="all-minilm"):
        text = text.replace("\n", " ").strip()
        if not text:
            return [0.0] * 384  # all-minilm has 384 dimensions

        # 1. Try /api/embeddings endpoint (standard Ollama endpoint)
        try:
            r = requests.post(f"{self.ollama_url}/api/embeddings", json={
                "model": model,
                "prompt": text
            }, timeout=15)
            if r.status_code == 200:
                data = r.json()
                if "embedding" in data:
                    return data["embedding"]
        except Exception:
            pass

        # 2. Try /api/embed endpoint (alternative/newer Ollama endpoint)
        try:
            r = requests.post(f"{self.ollama_url}/api/embed", json={
                "model": model,
                "input": text
            }, timeout=15)
            if r.status_code == 200:
                data = r.json()
                if "embeddings" in data and len(data["embeddings"]) > 0:
                    return data["embeddings"][0]
        except Exception:
            pass

        # 3. Fallback dummy embedding (random normal vector, normalized to unit length)
        # This prevents crashes if Ollama is offline or doesn't support embeddings.
        # We use a deterministic hash of the text so same text gets same vector.
        import hashlib
        h = hashlib.sha256(text.encode('utf-8')).digest()
        np.random.seed(int.from_bytes(h[:4], 'big'))
        vec = np.random.randn(384)
        vec = vec / np.linalg.norm(vec)
        return list(vec)

    def add_document(self, text, metadata, model="all-minilm"):
        embedding = self.get_embedding(text, model)
        doc_id = len(self.documents)
        self.documents.append({
            "id": doc_id,
            "text": text,
            "metadata": metadata,
            "embedding": embedding
        })

    def similarity_search(self, query, k=3, model="all-minilm"):
        if not self.documents:
            return []
        
        query_emb = self.get_embedding(query, model)
        query_vector = np.array(query_emb)
        
        scores = []
        for doc in self.documents:
            doc_vector = np.array(doc["embedding"])
            # Cosine similarity calculation
            dot_product = np.dot(query_vector, doc_vector)
            norm_q = np.linalg.norm(query_vector)
            norm_d = np.linalg.norm(doc_vector)
            if norm_q > 0 and norm_d > 0:
                score = dot_product / (norm_q * norm_d)
            else:
                score = 0.0
            scores.append((score, doc))
        
        # Sort by score descending
        scores.sort(key=lambda x: x[0], reverse=True)
        
        results = []
        for score, doc in scores[:k]:
            results.append({
                "score": float(score),
                "text": doc["text"],
                "metadata": doc["metadata"]
            })
        return results
