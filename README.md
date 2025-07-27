## Trusai

An AI-powered voice companion designed to be your trustworthy friend. When you’re feeling low, stressed, or simply need someone to listen, Trusai is here. Share your thoughts and feelings through speech and video, and Trusai will gently respond based on your emotional state.

---

### Key Features

- **Multimodal Emotion Detection**
  - **Speech Prosody**: Uses Hume AI’s Speech Prosody model to capture 48 emotional dimensions from your voice.
  - **Facial Expression**: A Flask API with a PyTorch-based model for recognizing 7 distinct facial emotions.
- **Real-time Conversation**
  - Start a call and speak freely. Trusai transcribes your speech (ASR), measures your prosody, and tracks facial cues.
  - Empathic AI response powered by Hume AI’s EVI (Empathic Voice Interface).
- **Fast & Low-Latency**
  - Near-instant transcript and emotion tagging for each sentence.
  - Streamed text and voice responses through our speech-language model.
- **Natural, Empathic Tone**
  - Trusai matches its tone to your mood—calm when you’re upset, upbeat when you’re excited.
  - Interruptible flow: it pauses seamlessly when you jump back in.

---

### How It Works

1. **Start the Conversation**\
   Click **Start Call** on the Next.js front end. Grant access to your camera and mic.
2. **Capture & Analyze**
   - Audio is sent to Hume AI’s ASR and prosody services.
   - Video frames go to the facial-emotion Flask API.
3. **Empathic Response**
   - Hume AI EVI processes transcripts and emotion signals.
   - A language model crafts a response that reflects your current state.
4. **Voice Reply**
   - Trusai replies via text and TTS voice, streamed back to your browser.

---

### Tech Stack

- **Frontend**: Next.js
- **Backend**: Flask API for facial-emotion detection
- **Models**:
  - Hume AI Speech Prosody (48 emotions)
  - PyTorch-based facial-emotion model (7 emotions)
  - Hume AI EVI (empathic responses)
- **Deploy**: Vercel (frontend), AWS/GCP or similar (backend)

---

### Installation & Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/trusai.git
   cd trusai
   ```
2. Install dependencies:
   - **Frontend**:
     ```bash
     cd Frontend
     npm install
     ```
   - **Backend**:
     ```bash
     cd Backend
     pip install -r requirements.txt
     ```
3. Configure environment variables:
   ```bash
   # .env
   HUME_API_KEY=<your-hume-api-key>
   ```
4. Run locally:
   - Frontend: `npm run dev`
   - Backend: `python app.py`

---

### Usage

1. Navigate to `http://localhost:3000`.
2. Click **Start Call** and allow camera/mic access.
3. Speak or show your face. Trusai will listen, observe, and respond.
4. Share what’s on your mind—feel supported by your AI friend.

---

### Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for bug fixes and new features.

---

### License

MIT License. See [LICENSE](LICENSE) for details.

