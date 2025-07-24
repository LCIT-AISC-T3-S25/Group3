
# 📘 README: Biomedical RAG (FAISS + LangChain)

This repository contains a Retrieval-Augmented Generation (RAG) pipeline for biomedical question answering using FAISS, LangChain, and Groq LLMs. The FAISS index is pre-built to avoid long embedding runtimes.

---

## Project Structure

```
rag_project/
├── r_a_g_(faiss_+_langchain).py         # Main pipeline
├── requirements.txt                     # Dependencies
├── checkpoint_all_chunks.pkl            # FAISS checkpoint
├── faiss_index_bioasq_full/             # Pre-built FAISS index
│   ├── index.faiss
│   └── index.pkl
```

---

##  Setup Instructions


1. Navigate into the project directory:
   ```bash
   cd rag_project
   ```
4. Install dependencies:
   pip install -r requirements.txt
   

5. (If not present) Download the FAISS index file and place it in:
   `faiss_index_bioasq_full/index.faiss`

6. Run the pipeline:
   python r_a_g_(faiss_+_langchain).py
   

>  You will be prompted to enter your GROQ API key securely. Use this website to signUp: "https://console.groq.com/"


---

## Evaluation

The pipeline evaluates model accuracy on biomedical test queries and prints expected vs predicted results with a final accuracy score.

---

## Tuning Steps the Model

To improve performance, you can tune the following components:

1. **Retrieval Parameters**:
   - Located in `get_rag_chain()`
   - Change `k` in `search_kwargs={"k": 5}`
   - Try `search_type="mmr"` for diverse results

2. **Prompt Template**:
   - Modify the prompt used in `PromptTemplate.from_template()`
   - Make it more concise, structured, or task-specific

3. **LLM Model**:
   - Change `MODEL_NAME` to another Groq model (e.g., `"mixtral-8x7b-32768"`)

4. **Evaluation Set**:
   - Add or replace questions in the `test_queries` list

5. **Logging**:
   - Enhance `evaluate_rag()` to write logs to a file for analysis
---

## Maintainer
Mueez Ur Rehman Amjad

