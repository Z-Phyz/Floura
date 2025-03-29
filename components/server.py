from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import storage
import os

app = Flask(__name__)
CORS(app)

# Set Google Cloud Storage credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "bake_with_ai/.next/clothingapp-437719-989838d53bb7.json"

# Google Cloud Storage bucket name
BUCKET_NAME = "bake_with_ai"

# Function to upload image
def upload_to_gcs(file, filename):
    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(filename)

    blob.upload_from_string(file.read(), content_type=file.content_type)
    blob.make_public()  # Make the image publicly accessible

    return blob.public_url  # Return the public URL of the image

@app.route("/", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No file part"}), 400

    image = request.files["image"]
    if image.filename == "":
        return jsonify({"error": "No selected file"}), 400

    image_url = upload_to_gcs(image, image.filename)
    return jsonify({"image_url": image_url})

if __name__ == "__main__":
    app.run(debug=True)
