import streamlit as st
import google.generativeai as genai

def configure_gemini(api_key):
    try:
        genai.configure(api_key=api_key)
        return True
    except Exception as e:
        st.error(f"Error configuring Gemini AI: {e}")
        return False
