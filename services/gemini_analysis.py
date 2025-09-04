import google.generativeai as genai
import os


def extract_recommendations(text):
    import re
    # Find all bullet points starting with * or -
    bullets = re.findall(r'^[\*-]\s*(.+)', text, re.MULTILINE)
    return bullets if bullets else [text.strip()]


def gemini_analyze_resume(resume, job_title, job_description):
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')

    shared_prompt_prefix = f"""
You are an expert resume analyst and career coach.
Analyze the resume for a "{job_title}" position.

JOB DESCRIPTION:
{job_description}

RESUME:
{resume}
"""

    prompts = {
        "score": shared_prompt_prefix + """
1. Match Score:
Provide only a numeric percentage indicating how well the resume matches the job description. 
Format: `85%` (no other text).
""",
        "matching_skills": shared_prompt_prefix + """
2. Matching Skills:
Compare the JOB DESCRIPTION and the RESUME.
Extract only the technical skills, programming languages, libraries, frameworks, tools, and platforms mentioned in the JOB DESCRIPTION.
From this list, identify:
   - Which of those skills are also found in the RESUME.
   - Which are missing (not found in the RESUME).
Return the result in the following format:
- Match Count: `X/Y`
- ✅ Matching Skills:
  - ...
- Miss Count: `Z/Y`
- ❌ Missing Skills:
  - ...
Do NOT include any explanations, summaries, or non-technical content. Only return the structured result in the format above.
""",
        "recommendations": shared_prompt_prefix + """
3. Recommendations for Improvement:
Based on the resume and job description, provide 3 to 5 **clear, actionable suggestions** to improve the resume **for this specific job**.
Write in a concise, friendly tone.
Use bullet points.
Do NOT include explanations, just the suggestions.
""",
        "ats_score": shared_prompt_prefix + """
4. ATS Optimization Score:
Assess how well the resume is optimized for Applicant Tracking Systems (ATS).
1. Provide an overall ATS optimization score as a **percentage** (e.g., `85%`). Do NOT add extra text before or after the score.
2. Then, give 1–3 bullet points too short explaining **why** this score was given (e.g., keyword usage, formatting, structure).
Keep it concise and user-friendly.
"""
    }


    def query_gemini(prompt):
        print("[Gemini Analysis] Sending prompt to Gemini API.")
        response = model.generate_content(prompt)
        print(f"[Gemini Analysis] Response: {response.text}")
        return response.text

    analysis = {}
    try:
        print("[Gemini Analysis] Starting analysis...")
        analysis["score"] = extract_score(query_gemini(prompts["score"]))
        analysis["matching_skills"] = query_gemini(prompts["matching_skills"])
        raw_recommendations = query_gemini(prompts["recommendations"])
        analysis["recommendations"] = extract_recommendations(raw_recommendations)
        analysis["ats_score"] = query_gemini(prompts["ats_score"])
        print(f"[Gemini Analysis] Analysis complete. Score: {analysis['score']}")
        return analysis
    except Exception as e:
        print(f"[Gemini Analysis] Error: {e}")
        return {"error": str(e)}

def extract_score(text):
    # Extract percentage score from response
    import re
    match = re.search(r'(\d{1,3})%', text)
    if match:
        return int(match.group(1))
    return None
