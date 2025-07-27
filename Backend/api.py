from flask import Flask, request, jsonify
import cv2
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from approach.EmotiNet import EmotiNet  # type: ignore
import numpy as np
from flask_cors import CORS
import io

# Flask app
app = Flask(__name__)

CORS(app)

# Setup device
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

# Emotion classes
emotions = ['happy', 'surprise', 'sad', 'anger', 'disgust', 'fear', 'neutral']

# Load the model
model = EmotiNet().to(device)
checkpoint = torch.load(
    r'F:\FYP\vision\vision\rafdb_model_revised.pth', map_location=torch.device('cpu'))
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

# Define transformations
transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# Load Haar Cascade for face detection
face_classifier = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)


def detect_emotion(image):
    """
    Preprocess and detect emotions in an image.
    """
    img_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(img_tensor)
        scores = outputs.cpu().numpy().flatten()
        rounded_scores = {emotions[i]: round(
            score, 2) for i, score in enumerate(scores)}
    return rounded_scores


@app.route('/detect_emotion', methods=['POST'])
def detect_emotion_api():
    """
    Flask API endpoint to detect emotions from an uploaded image.
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    # Load the image
    file = request.files['image']
    img = Image.open(file.stream)

    # Convert image to numpy array for face detection
    img_cv2 = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    gray_image = cv2.cvtColor(img_cv2, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_classifier.detectMultiScale(
        gray_image, 1.1, 5, minSize=(24, 24))

    if len(faces) == 0:
        return jsonify({"error": "No faces detected."}), 400

    # Process each detected face
    results = []
    for (x, y, w, h) in faces:
        crop_img = img_cv2[y:y + h, x:x + w]
        pil_crop_img = Image.fromarray(crop_img)
        rounded_scores = detect_emotion(pil_crop_img)

       # Convert scores to Python float
        rounded_scores = {emotion: float(score)
                          for emotion, score in rounded_scores.items()}

        results.append({"face_coordinates": [int(x), int(
            y), int(w), int(h)], "emotions": rounded_scores})

    return jsonify({"results": results})


if __name__ == '__main__':
    app.run(debug=True)
