from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from flask_backend.models import db
from models.code_snippet import CodeSnippet

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)

# Initialize Database
with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return "Flask + PostgreSQL Connected!"

# Save Code to Database
@app.route("/save", methods=["POST"])
def save_code():
    data = request.json
    new_code = CodeSnippet(title=data["title"], content=data["content"])
    db.session.add(new_code)
    db.session.commit()
    return jsonify({"message": "Code saved successfully!"})

# Fetch All Saved Code
@app.route("/codes", methods=["GET"])
def get_codes():
    codes = CodeSnippet.query.all()
    return jsonify([{"id": c.id, "title": c.title, "content": c.content} for c in codes])

if __name__ == "__main__":
    app.run(debug=True)
