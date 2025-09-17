from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from services import analyzer, gemini_analysis, resume_generator, vertex_analysis
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
app.config['UPLOAD_FOLDER'] = 'uploads/'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Upload resume
@app.route('/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    # Store uploaded file path globally for later use
    global uploaded_resume_path
    uploaded_resume_path = filepath
    return jsonify({'filename': filename, 'filepath': filepath}), 200

# Analyze resume
@app.route('/analyze', methods=['POST'])
def analyze_resume():
    data = request.get_json()
    resume_text = data.get('resume')
    job_title = data.get('job_title')
    job_description = data.get('job_description')
    if not resume_text or not job_title or not job_description:
        return jsonify({'error': 'Missing resume, job_title, or job_description'}), 400
    # Store resume and job info globally for chat context
    global uploaded_resume, uploaded_job_title, uploaded_job_description, uploaded_analysis_result
    uploaded_resume = resume_text
    uploaded_job_title = job_title
    uploaded_job_description = job_description
    result = gemini_analysis.gemini_analyze_resume(resume_text, job_title, job_description)
    # Extract ATS score as integer from Gemini's ats_score response
    import re
    ats_score = None
    if isinstance(result, dict) and 'ats_score' in result:
        match = re.search(r'(\d{1,3})%', str(result['ats_score']))
        if match:
            ats_score = int(match.group(1))
    if isinstance(result, dict):
        result['ats_score_value'] = ats_score
    uploaded_analysis_result = result
    return jsonify(result), 200

# Get analysis report
@app.route('/report', methods=['GET'])
def get_report():
    filename = request.args.get('filename')
    report_path = f'resume_analysis_report.html'
    if not os.path.exists(report_path):
        return jsonify({'error': 'Report not found'}), 404
    return send_file(report_path)

# Get extracted keywords
@app.route('/keywords', methods=['GET'])
def get_keywords():
    filename = request.args.get('filename')
    keywords = analyzer.extract_keywords(filename)
    return jsonify({'keywords': keywords}), 200


# Get all scores (overall, keyword, ATS)
@app.route('/scores', methods=['GET'])
def get_scores():
    filename = request.args.get('filename')
    job_title = request.args.get('job_title')
    job_description = request.args.get('job_description')
    overall_score = analyzer.get_score(filename)
    keyword_score = analyzer.get_keyword_match_score(filename, job_title, job_description)
    ats_score = analyzer.get_ats_score(filename, job_title, job_description) if hasattr(analyzer, 'get_ats_score') else None
    return jsonify({
        'overall_score': overall_score,
        'keyword_score': keyword_score,
        'ats_score': ats_score
    }), 200

# Get job requirements
@app.route('/requirements', methods=['GET'])
def get_requirements():
    requirements = analyzer.get_requirements()
    return jsonify({'requirements': requirements}), 200

# Get previous scans
@app.route('/previous', methods=['GET'])
def get_previous_scans():
    scans = analyzer.get_previous_scans()
    return jsonify({'previous_scans': scans}), 200

    # Chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    from services.chat_handler import handle_chat_message
    data = request.get_json()
    message = data.get('message', '')
    # Try to get from request, else fallback to session or global context
    resume = data.get('resume')
    job_title = data.get('job_title')
    job_description = data.get('job_description')
    analysis_result = data.get('analysis_result')

    # Fallback: try to get from session (Flask session or other context)
    # For demo, use global variables (should be replaced with proper session management)
    global uploaded_resume, uploaded_job_title, uploaded_job_description, uploaded_analysis_result
    if resume is None:
        resume = uploaded_resume if 'uploaded_resume' in globals() else ''
    if job_title is None:
        job_title = uploaded_job_title if 'uploaded_job_title' in globals() else ''
    if job_description is None:
        job_description = uploaded_job_description if 'uploaded_job_description' in globals() else ''
    if analysis_result is None:
        analysis_result = uploaded_analysis_result if 'uploaded_analysis_result' in globals() else ''
    # Call the chat handler to get an answer based on the uploaded CV and job info
    # Friendly greeting for simple messages
    greeting_keywords = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]
    if message.strip().lower() in greeting_keywords:
        reply = "Hello! 👋 I'm here to help you analyze your resume for your target job. Ask me anything about your resume or the job description!"
    elif not resume or not job_title or not job_description:
        reply = (
            "Okay, I can help you figure out if your resume is a good fit for the job you're targeting.\n\n"
            "To give you a specific and helpful answer, I need you to provide the following information:\n"
            "* **JOB TITLE:** The exact job title you are applying for.\n"
            "* **JOB DESCRIPTION:** The complete job description for the position you are applying for. Please copy and paste the entire job description.\n"
            "* **RESUME:** The complete resume you want me to analyze. Please copy and paste the entire resume.\n\n"
            "Once you provide that information, I will analyze your resume based on the job description, and will tell you:\n"
            "* **Overall Fit:** A clear statement of whether your resume is a good fit for the job.\n"
            "* **Strengths:** What aspects of your resume align well with the job requirements.\n"
            "* **Weaknesses:** What aspects of your resume are missing or could be improved to better match the job requirements.\n"
            "* **Actionable Recommendations:** Specific suggestions on how to improve your resume to make it a stronger candidate for the position. This will include things like:\n"
            "    * Keywords to add\n"
            "    * Skills to highlight\n"
            "    * Experience to emphasize\n"
            "    * Sections to re-organize\n"
            "    * Quantifiable results to include\n\n"
            "I look forward to helping you refine your resume!"
        )
    else:
        raw_reply = handle_chat_message(message, resume, job_title, job_description, analysis_result)
        # Format the response for user readability
        def format_analysis(text):
            import re
            # Add spacing after section headers
            text = re.sub(r'(Overall Assessment:)', r'\n**\1**\n', text)
            text = re.sub(r'(Strengths \(Based on Analysis\):)', r'\n**1. \1**\n', text)
            text = re.sub(r'(Weaknesses & Areas for Improvement \(Critical\):)', r'\n**2. \1**\n', text)
            text = re.sub(r'(Actionable Steps to Take \(Prioritized\):)', r'\n**3. \1**\n', text)
            text = re.sub(r'(Specific Examples of Resume Changes:)', r'\n**4. \1**\n', text)
            text = re.sub(r'(Addressing the "Missing Skills":)', r'\n**5. \1**\n', text)
            text = re.sub(r'(In summary:)', r'\n**Summary:**\n', text)
            text = re.sub(r'(Good luck!)', r'\n**Good luck!**', text)
            # Add bullet spacing
            text = re.sub(r'\* ', r'\n- ', text)
            return text.strip()
        reply = format_analysis(raw_reply)
    response = {"reply": reply}
    return jsonify(response), 200
if __name__ == '__main__':
    app.run(debug=True)
# app.py

