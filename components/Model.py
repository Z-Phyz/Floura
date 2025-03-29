import requests
import google.generativeai as genai
import base64
from io import BytesIO
from PIL import Image
from google.genai import types
from flask import Flask, request, jsonify
from flask_cors import CORS

genai.configure(api_key="AIzaSyAGUMWqZGdAVqdik7YN0mYWXDQh1HwL2PQ")
model = genai.GenerativeModel("gemini-2.0-flash")
app = Flask(__name__)
CORS(app)  # Allows React to communicate with Flask

@app.route("/", methods=["POST"])
def receive_data():
    data = request.json
    print("Received from React:", data)
    z=data['text']
    response=model.generate_content("Convert the ingredients in grams and make sure you dont use indentations for bold words also return in a single line without any additional information"+z)
    print(response)
    return jsonify(response.text)

if __name__ == "__main__":
    app.run(debug=True)

#import ''
# Set API Key
