import { useState } from "react";

const VoiceInput = ({
  onTextRecognized,
}: {
  onTextRecognized: (text: string) => void;
}) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) =>
      console.error("Speech recognition error:", event.error);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTextRecognized(transcript);
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>
        🎤 {isListening ? "Listening..." : "Start Voice Input"}
      </button>
    </div>
  );
};

export default VoiceInput;
