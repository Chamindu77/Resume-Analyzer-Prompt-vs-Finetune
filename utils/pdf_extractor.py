import tempfile
import PyPDF2
import os

def extract_text_from_pdf(pdf_file):
    text = ""
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(pdf_file.read())
        temp_file_path = temp_file.name

    with open(temp_file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()

    os.unlink(temp_file_path)
    return text
