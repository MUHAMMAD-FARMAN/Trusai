import cv2
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from approach.EmotiNet import EmotiNet  # type: ignore
import numpy as np

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
        rounded_scores = [round(score, 2) for score in scores]
    return rounded_scores


def process_image(image_path):
    """
    Process the given image: detect faces, emotions, and display probabilities.
    """
    # Read the image
    image = cv2.imread(image_path)

    # Resize for consistent processing
    image = cv2.resize(image, (800, 600))
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_classifier.detectMultiScale(
        gray_image, 1.1, 5, minSize=(24, 24))
    for (x, y, w, h) in faces:
        # Crop face and detect emotion
        crop_img = image[y:y + h, x:x + w]
        pil_crop_img = Image.fromarray(crop_img)
        rounded_scores = detect_emotion(pil_crop_img)

        # Print emotion probabilities
        print(f"Emotion probabilities for detected face:")
        for idx, score in enumerate(rounded_scores):
            print(f"  {emotions[idx]}: {score:.2f}")


# Test with a specific image
# Update with test image path
image_path = r"F:\FYP\vision\vision\download.jpeg"
process_image(image_path)
