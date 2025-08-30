import streamlit as st
from services.resume_generator import generate_sample_resume
import google.generativeai as genai

def handle_chat_message(message, resume_text, job_title, job_description, analysis_result):
    if any(kw in message.lower() for kw in ["generate resume", "optimized resume", "sample resume"]):
        st.info("Generating optimized resume...")
        return generate_sample_resume(resume_text, job_title, job_description, analysis_result)

    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
    prompt = f"""
You are a helpful resume coach. Based on the following:

RESUME:
{resume_text}

JOB TITLE:
{job_title}

JOB DESCRIPTION:
{job_description}

ANALYSIS:
{analysis_result}

QUESTION:
{message}

Give a clear, helpful, and actionable answer.
"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"

def submit_message():
    user_message = st.session_state.user_input
    if user_message:
        st.session_state.chat_history.append({"text": user_message, "is_user": True})
        with st.spinner("Thinking..."):
            reply = handle_chat_message(
                user_message,
                st.session_state.resume_text,
                st.session_state.job_title,
                st.session_state.job_description,
                st.session_state.analysis_result
            )
        st.session_state.chat_history.append({"text": reply, "is_user": False})
        st.session_state.user_input = ""
