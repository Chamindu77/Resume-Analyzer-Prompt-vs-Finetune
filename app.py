# app.py
import streamlit as st
import os
from dotenv import load_dotenv

from utils.pdf_extractor import extract_text_from_pdf
from utils.ui_helpers import section_header, load_custom_css
from services.gemini_config import configure_gemini
from services.analyzer import analyze_resume, ask_question_about_resume
from services.chat_handler import handle_chat_message, submit_message

# Load environment
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

st.set_page_config(
    page_title="AI Resume Analyzer",
    page_icon="📝",
    layout="wide"
)

load_custom_css()

# Initialize session state
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'analysis_result' not in st.session_state:
    st.session_state.analysis_result = ""
if 'user_input' not in st.session_state:
    st.session_state.user_input = ""
if 'resume_text' not in st.session_state:
    st.session_state.resume_text = ""
if 'job_title' not in st.session_state:
    st.session_state.job_title = ""
if 'job_description' not in st.session_state:
    st.session_state.job_description = ""

# Load from .env
if GEMINI_API_KEY and configure_gemini(GEMINI_API_KEY):
    st.sidebar.success("Gemini API configured ✅")
else:
    st.sidebar.error("Failed to load Gemini API key ❌")


# Tabs
tab1, tab2 = st.tabs(["Resume Analysis", "Ask Questions"])

with tab1:
    col1, col2 = st.columns(2)
    with col1:
        st.markdown(section_header("📄 Upload Your Resume", "📄"), unsafe_allow_html=True)
        uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")
        if uploaded_file:
            resume_text = extract_text_from_pdf(uploaded_file)
            st.session_state.resume_text = resume_text
            st.text_area("Extracted Text", resume_text[:1000], height=200)
    with col2:
        st.markdown(section_header("💼 Job Details", "📋"), unsafe_allow_html=True)
        job_title = st.text_input("Job Title")
        job_description = st.text_area("Job Description", height=200)
        st.session_state.job_title = job_title
        st.session_state.job_description = job_description

    if st.button("🔍 Analyze Resume") and all([GEMINI_API_KEY, resume_text, job_title, job_description]):
        analysis = analyze_resume(resume_text, job_title, job_description)
        st.session_state.analysis_result = analysis

    if st.session_state.analysis_result:
        st.markdown(section_header("📊 Analysis Results", "🌟"), unsafe_allow_html=True)
        st.markdown(st.session_state.analysis_result)

    

with tab2:
    if not st.session_state.resume_text or not st.session_state.job_title or not st.session_state.job_description:
        st.info("Please upload resume and job info in the first tab")
    else:
        question = st.text_area("Ask your question")
        if st.button("Get Answer"):
            answer = ask_question_about_resume(
                st.session_state.resume_text,
                st.session_state.job_title,
                st.session_state.job_description,
                question
            )
            st.markdown(answer)


