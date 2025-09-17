def custom_ats_score(resume_text, job_title=None, job_description=None):
    """
    Custom ATS scoring function (not connected to the app).
    Example: Score based on keyword match and section presence.
    """
    if job_title is None:
        job_title = 'Software Engineer'
    if job_description is None:
        job_description = ''

    # Example: Score based on presence of key sections and keyword match
    required_sections = ["summary", "experience", "education", "skills"]
    section_score = sum(1 for sec in required_sections if sec in resume_text.lower()) / len(required_sections)

    # Extract keywords from job description (simple split, can be improved)
    import re
    words = re.findall(r'\b\w+\b', job_description.lower())
    keywords = set(w for w in words if len(w) > 3)
    resume_words = set(re.findall(r'\b\w+\b', resume_text.lower()))
    keyword_matches = len(keywords & resume_words)
    keyword_score = keyword_matches / max(len(keywords), 1)

    # Weighted sum: 60% keywords, 40% sections
    ats_score = int((keyword_score * 0.6 + section_score * 0.4) * 100)
    return ats_score
