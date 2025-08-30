import google.generativeai as genai


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
Format: `85%` (no other text).
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






# def analyze_resume(resume_text, job_title, job_description):
#     model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
#     prompt = f"""
# Act as an expert resume analyst and career coach. You are analyzing a resume for a "{job_title}" position.

# JOB DESCRIPTION:
# {job_description}

# RESUME:
# {resume_text}

# Please provide a structured analysis as follows:
# Please follow the structure exactly and ensure all five sections are included in the response.


# 1. **Match Score**  
# Provide only a numeric percentage indicating how well the resume matches the job description.  
# Format: `85%` (No other text or explanation).

# 2. **Matching Skills/Keywords**  
# List point-wise the specific skills or keywords that are present in both the resume and job description.

# 3. **Missing Skills/Keywords**  
# List point-wise the important skills or keywords from the job description that are missing in the resume.

# 4. **Recommendations for Improvement**  
# Provide 3 to 5 clear, actionable suggestions to improve this resume for this specific job application.

# 5. **ATS Optimization Score**  
# Give a score between 0 and 100 indicating how well this resume is optimized for Applicant Tracking Systems (ATS).  

# 6. Justification: Also include 1–2 brief points justifying this score (e.g., keyword usage, formatting, etc.).

# """
#     try:
#         response = model.generate_content(prompt)
#         print("Gemini response:", response.text)
#         return response.text
#     except Exception as e:
#         return f"Error analyzing resume: {e}"



# Provide a comprehensive analysis of the resume compared to the job requirements. Structure your analysis as follows:

# 1. Match Score: Provide a only percentage match score between the resume and job description no any other text want to percentage score.

# 4. Missing Skills/Keywords: give point vice only Identify specific skills or keywords from the job description that are missing in the resume.

# 4. Matching Skills/Keywords: give point vice only Identify specific skills or keywords from the job description that are matching in the resume.


# 2. Key Strengths: List 3-5 strengths in the resume that align well with the job requirements.

# 3. Improvement Areas: List 3-5 specific areas where the resume could be improved to better match the job.

# 4. Missing Skills/Keywords: Identify specific skills or keywords from the job description that are missing in the resume.

# 5. Format and Presentation: Analyze the structure, organization, and presentation of the resume.

# 6. Action Items: Provide 3-5 specific, actionable recommendations to improve the resume for this specific job application.
