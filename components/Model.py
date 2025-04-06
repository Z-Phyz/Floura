import requests
import time
import google.generativeai as genai
import base64
from google.cloud import storage
import os
from io import BytesIO
from PIL import Image
from google.genai import types
from flask import Flask, request, jsonify
from flask_cors import CORS

BUCKET_NAME = "cookies_z"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/shivangipal/bake_with_ai/bakewith-899f8ae2d313.json"
genai.configure(api_key="AIzaSyAGUMWqZGdAVqdik7YN0mYWXDQh1HwL2PQ")
model = genai.GenerativeModel("gemini-2.0-flash")
app = Flask(__name__)
CORS(app)  # Allows React to communicate with 

def upload_to_gcs(file):
    """Uploads file to Google Cloud Storage and returns its public URL"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(file.filename)
    blob.upload_from_file(file, content_type=file.content_type)
    time.sleep(2)
    return blob.public_url  # Returns the public URL of the uploaded image

def get_base64_image(image_url):
    response = requests.get(image_url)
    response.raise_for_status()  # Ensure request was successful
    image_bytes = BytesIO(response.content).getvalue()
    return base64.b64encode(image_bytes).decode("utf-8")

@app.route("/convert", methods=["POST"])
def receive_data():
    data = request.json
    print("Received from React:", data)
    z=data['text']
    response=model.generate_content("Convert the ingredients in grams and make sure you dont use indentations for bold words also return in a single line without any additional information"+z)
    print(response)
    return jsonify(response.text)

@app.route("/process", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No file part"}), 400

    image = request.files["image"]
    if image.filename == "":
        return jsonify({"error": "No selected file"}), 400

    image_url = upload_to_gcs(image)
    return jsonify({"image_url": image_url})

@app.route("/convertz", methods=["POST"])
def convert_image():
    data=request.json
    print(data)
    image_path=data['text']
    image=get_base64_image(image_path)
    # Load the Gemini model
    # Generate a response
    response = model.generate_content([
        {"text": "Describe the contents of this image."},
        {"inline_data": {"mime_type": "image/png", "data":image}}
    ])
    return jsonify(response.text)



if __name__ == "__main__":
    app.run(debug=True)

#import ''
# Set API Key
