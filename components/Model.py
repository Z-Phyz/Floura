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

def get_base64_image(image_url):
    response = requests.get(image_url)
    response.raise_for_status()  # Ensure request was successful
    image_bytes = BytesIO(response.content).getvalue()
    return base64.b64encode(image_bytes).decode("utf-8")

image_path=""
image=get_base64_image(image_path)
# Load the Gemini model
# Generate a response
response = model.generate_content([
    {"text": "convert the ingredients in grams and make sure you dont use indentations for bold words and no extra information."},
    {"inline_data": {"mime_type": "image/png", "data":image}}
])
print(response.text)
