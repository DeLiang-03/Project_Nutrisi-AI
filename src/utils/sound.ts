// Web Speech API Voice Synthesizer for NutriBot Sahabat Anak

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakNutriBotMessage(text: string, onEnd?: () => void): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  // Strip markdown formatting symbols (*, #, emojis, etc.) for clean natural voice
  const cleanText = text
    .replace(/[#*_`~>-]/g, '')
    .replace(/🎉|💪|🦴|🧠|⚡|🛡️|💡|✨|⭐|🥗|🍎|🍗|🥦/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.15; // friendly, upbeat pitch for children

  // Look for Indonesian voice
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().includes('indonesia'));
  if (idVoice) {
    utterance.voice = idVoice;
  }

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onEnd?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
