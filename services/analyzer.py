
import google.generativeai as genai
import os
import json
from utils.pdf_extractor import extract_text_from_pdf


def analyze_resume(resume_text, job_title, job_description):
    #import genai  # Ensure gemini client is imported

    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')

    # Shared prefix for all prompts
    shared_prompt_prefix = f"""
You are an expert resume analyst and career coach.
Analyze the resume for a "{job_title}" position.

JOB DESCRIPTION:
{job_description}

RESUME:
{resume_text}
"""

    # Define modular prompts
    match_score_prompt = shared_prompt_prefix + """
1. Match Score:
Provide only a numeric percentage indicating how well the resume matches the job description.
Format: [numeric percentage only, e.g. 68%] (no other text).
"""

    matching_keywords_prompt = shared_prompt_prefix + """
2. Matching Skills:
Compare the JOB DESCRIPTION and the RESUME.

1. Extract only the technical skills, programming languages, libraries, frameworks, tools, and platforms mentioned in the JOB DESCRIPTION.
   (Ignore soft skills, job responsibilities, or general descriptions.)

2. From this list, identify:
   - Which of those skills are also found in the RESUME.
   - Which are missing (not found in the RESUME).

3. Return the result in the following format:
- Match Count: `X/Y` (X = number of matched skills, Y = total required skills from the JD)
- ✅ Matching Skills:
  - ...
  - ...

- Miss Count: `Z/Y` (Z = number of not matched skills, Y = total required skills from the JD)
- ❌ Missing Skills:
  - ...

Do NOT include any explanations, summaries, or non-technical content. Only return the structured result in the format above.
"""

    recommendations_prompt = shared_prompt_prefix + """
3. Recommendations for Improvement:
Based on the resume and job description, provide 3 to 5 **clear, actionable suggestions** to improve the resume **for this specific job**.
Write in a concise, friendly tone.
Use bullet points.
Do NOT include explanations, just the suggestions.
"""

    ats_score_prompt = shared_prompt_prefix + """
4. ATS Optimization Score:
Assess how well the resume is optimized for Applicant Tracking Systems (ATS).
1. Provide an overall ATS optimization score as a **percentage** (e.g., `85%`). Do NOT add extra text before or after the score.
2. Then, give 1–3 bullet points too short explaining **why** this score was given (e.g., keyword usage, formatting, structure).
Keep it concise and user-friendly.
"""

    try:
        # Generate each section separately
        match_score = model.generate_content(match_score_prompt).text
        matching_keywords = model.generate_content(matching_keywords_prompt).text
        recommendations = model.generate_content(recommendations_prompt).text
        ats_score = model.generate_content(ats_score_prompt).text

        # Combine results
        final_analysis = f"""
Match Score:
{match_score}

Matching & Missing Skills:
{matching_keywords}

Recommendations for Improvement:
{recommendations}

ATS Optimization Score:
{ats_score}
"""
        print(final_analysis)
        return final_analysis

    except Exception as e:
        return f"Error analyzing resume: {e}"



def ask_question_about_resume(resume_text, job_title, job_description, question):
    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
    prompt = f"""
You are analyzing a resume for a {job_title} position.

JOB DESCRIPTION:
{job_description}

RESUME:
{resume_text}

QUESTION: {question}

Please provide a clear and helpful answer based on the analysis.
"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"




def extract_keywords(filename):
    # Extract text from PDF
    with open(filename, 'rb') as f:
        resume_text = extract_text_from_pdf(f)
    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
    prompt = f"""
You are an expert resume analyst.
Extract only the technical keywords, programming languages, libraries, frameworks, tools, and platforms from the following resume:
{resume_text}
Return as a JSON array.
"""
    try:
        response = model.generate_content(prompt)
        keywords = json.loads(response.text)
        return keywords
    except Exception as e:
        return [f"Error: {e}"]

def get_score(filename):
    with open(filename, 'rb') as f:
        resume_text = extract_text_from_pdf(f)
    job_title = os.getenv('DEFAULT_JOB_TITLE', 'Software Engineer')
    job_description = os.getenv('DEFAULT_JOB_DESCRIPTION', 'N/A')
    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
    prompt = f"""
You are an expert resume analyst.
Provide only a numeric percentage indicating how well the resume matches the job description for a {job_title} position.
JOB DESCRIPTION:
{job_description}
RESUME:
{resume_text}
Format: [numeric percentage only, e.g. 68%] (no other text).
"""
    try:
        response = model.generate_content(prompt)
        import re
        match = re.search(r'(\d{1,3})%', response.text)
        if match:
            return int(match.group(1))
        return 0
    except Exception as e:
        return 0

def get_requirements():
    job_description = os.getenv('DEFAULT_JOB_DESCRIPTION', 'N/A')
    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
    prompt = f"""
Extract all technical requirements from the following job description:
{job_description}
Return as a JSON array.
"""
    try:
        response = model.generate_content(prompt)
        requirements = json.loads(response.text)
        return requirements
    except Exception as e:
        return [f"Error: {e}"]

def get_previous_scans():
    # Placeholder: return static or empty list
    return []

def get_keyword_match_score(filename, job_title=None, job_description=None):
    from utils.pdf_extractor import extract_text_from_pdf
    with open(filename, 'rb') as f:
        resume_text = extract_text_from_pdf(f)
    if job_title is None:
        job_title = os.getenv('DEFAULT_JOB_TITLE', 'Software Engineer')
    if job_description is None:
        job_description = os.getenv('DEFAULT_JOB_DESCRIPTION', 'N/A')
    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
    prompt = f"""
Compare the JOB DESCRIPTION and the RESUME.
1. Extract all technical skills, programming languages, libraries, frameworks, tools, and platforms from the JOB DESCRIPTION.
2. From this list, count how many are present in the RESUME.
3. Calculate a keyword match score as a percentage: (number of matched keywords / total required keywords) * 100.
4. Return only the numeric percentage score (e.g., `72%`). Do NOT include any other text.
JOB DESCRIPTION:
{job_description}
RESUME:
{resume_text}
"""
    try:
        response = model.generate_content(prompt)
        import re
        match = re.search(r'(\d{1,3})%', response.text)
        if match:
            return int(match.group(1))
        return 0
    except Exception as e:
        return 0