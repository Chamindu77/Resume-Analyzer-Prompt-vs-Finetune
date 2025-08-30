import google.generativeai as genai

def generate_sample_resume(resume_text, job_title, job_description, analysis_result):
    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
    prompt = f"""
Act as an expert resume writer. Based on the following information, create a sample optimized resume for the {job_title} role.

ORIGINAL RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

ANALYSIS OF THE ORIGINAL RESUME:
{analysis_result}

Create a well-formatted, professional resume that:
- Incorporates missing skills/keywords
- Addresses improvement areas
- Enhances existing strengths
- Follows an ATS-friendly format
- Includes Summary, Experience, Skills, Education, etc.

Format using markdown.
"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating sample resume: {e}"
