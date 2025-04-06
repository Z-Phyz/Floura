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
from dotenv import load_dotenv
import os

BUCKET_NAME = "cookies_z"
load_dotenv()  # Load from .env
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
genai.configure(api_key=os.getenv("API_KEY"))
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
    x=data['utensils']
    y=str(data['nutsWhole'])
    w=str(data['humidity'])
    response=model.generate_content("Convert the ingredients in grams and make sure you dont use indentations for bold words or double asteriks also return in a single line without any additional information"+z+"take into account the humidity when calculating weight however if negligible dont mention it"+w+"if any nuts are whole or chopped where whole means true in calculating weigth too"+y+"and take in account the utensils used too"+x+"if you recieve anything other than a food item or recipe say enter a valid recipe")
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
    x=data['utensils']
    y=str(data['nutsWhole'])
    w=str(data['humidity'])
    # Load the Gemini model
    # Generate a response
    from mimetypes import guess_type
    mime_type = guess_type(image_path)[0]  # e.g., 'image/jpeg'

    response = model.generate_content([
        {"text": "Convert the ingredients in grams and make sure you dont use indentations for bold words or double asteriks also return in a single line without any additional information take into account the humidity when calculating weight however if negligible dont mention it"+w+"if any nuts are whole or chopped where whole means true in calculating weigth too"+y+"and take in account the utensils used too"+x+"if you recieve anything other than a food item or recipe say enter a valid recipe"},
        {"inline_data": {"mime_type": mime_type, "data":image}}
    ])
    return jsonify(response.text)



if __name__ == "__main__":
    app.run(debug=True)

#import ''
# Set API Key
