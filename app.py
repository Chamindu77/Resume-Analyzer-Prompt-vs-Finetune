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
    result = gemini_analysis.gemini_analyze_resume(resume_text, job_title, job_description)
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

if __name__ == '__main__':
    app.run(debug=True)
# app.py

