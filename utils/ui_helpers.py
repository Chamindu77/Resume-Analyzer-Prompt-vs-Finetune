import streamlit as st

def section_header(title, icon):
    return f"<div class='section-header'>{icon} {title}</div>"

def load_custom_css():
    with open("assets/styles.css", "r") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
