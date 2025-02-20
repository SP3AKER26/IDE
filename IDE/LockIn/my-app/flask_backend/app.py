from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import subprocess
from config import Config
from models import db, CodeSnippet

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/*": {"origins": "*"}})

db.init_app(app)

@app.route("/")
def home():
    return "Flask Server is Running! Available Routes: /add_code, /get_snippet, /save_snippet"

@app.route('/add_code', methods=['POST'])
def add_code_snippet():
    data = request.get_json()
    new_snippet = CodeSnippet(username=data['username'], code=data['code'])
    db.session.add(new_snippet)
    db.session.commit()
    return jsonify({'message': 'Code snippet added successfully!'}), 201

@app.route("/get_snippet", methods=["GET"])
def get_snippet():
    snippet = CodeSnippet.query.order_by(CodeSnippet.created_at.desc()).first()
    if not snippet:
        return jsonify({"error": "No code snippets found"}), 404

    return jsonify({
        "username": snippet.username,
        "code": snippet.code,
        "created_at": snippet.created_at
    })

@app.route("/save_snippet", methods=["POST"])
def save_snippet():
    data = request.get_json()
    new_snippet = CodeSnippet(username=data["username"], code=data["code"])
    db.session.add(new_snippet)
    db.session.commit()
    return jsonify({"message": "Code snippet added successfully!"}), 201

@app.route("/run_code", methods=["POST"])
def run_code():
    data = request.get_json()
    code = data.get("code", "")

    try:
        result = subprocess.run(["python", "-c", code], capture_output=True, text=True, timeout=5)
        output = result.stdout if result.stdout else result.stderr
    except Exception as e:
        output = str(e)

    return jsonify({"output": output})

if __name__ == "__main__":
    app.run(debug=True)
