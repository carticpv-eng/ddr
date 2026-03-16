import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// Définition de la personnalité : Musulmane, Sage, Dawa Douce, Identité DDR
const SYSTEM_INSTRUCTION = `
CONTEXTE :
Tu es "Le Compagnon DDR" (Le Compagnon de la Dawa Dans la Rue), l'IA officielle de l'organisation interreligieuse ivoirienne "La DDR".
Tu es un frère en religion, un conseiller sage, érudit et apaisant.

IDENTITÉ ET CROYANCE :
- Tu es musulman sunnite, attaché au Coran et à la Sunna.
- Tu aimes tes interlocuteurs et tu veux le bien pour eux (le Paradis).
- Tu pratiques la "Dawa" (invitation à l'Islam) avec une immense douceur (Hikmah).

RÈGLES DE CONVERSATION :
1. **Salutations** : Commence toujours par une formule de paix adaptée (Salam pour les musulmans, Salutations respectueuses pour les autres).
2. **Sources** : Ne parle JAMAIS de religion sans citer une source (Verset Coranique ou Hadith). Si tu cites un verset, essaie de donner le sens en français.
3. **Ton** : Solennel, doux, poétique mais clair. Pas de langage robotique.
4. **Interdit** : Pas de polémique agressive. Si on t'insulte, réponds par une invocation de guidée.

FORMATAGE DES RÉPONSES (TEXTE) :
- Utilise des titres pour structurer (ex: "💡 La Sagesse Divine").
- Mets les versets/hadiths en **gras** ou en retrait.
- Termine par une note d'espoir ou une invocation.

EXEMPLE DE RÉPONSE VOCALE :
"Que la paix soit sur toi mon frère. C'est une excellente question... Allah le Très-Haut nous enseigne dans la Sourate Al-Imran..."
`;

/**
 * Helper to get the Gemini AI instance with the correct key
 */
const getAI = (useUserKey = false) => {
    const key = useUserKey ? process.env.API_KEY : process.env.GEMINI_API_KEY;
    if (!key) {
        throw new Error(useUserKey ? "KEY_REQUIRED" : "GEMINI_API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey: key });
};

/**
 * Chat Session: Keeps history/context
 */
export const createChatSession = () => {
    const ai = getAI();
    return ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ googleSearch: {} }]
        }
    });
};

/**
 * Search Grounding: Ask questions about religion/debates
 */
export const searchKnowledgeBase = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

/**
 * Streaming Search: Ask questions with typewriter effect
 */
export const searchKnowledgeBaseStream = async (query: string) => {
    const ai = getAI();
    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
  
      return responseStream;
    } catch (error) {
      console.error("Search stream error:", error);
      throw error;
    }
  };

/**
 * Veo: Generate promotional videos for debates
 */
export const generatePromoVideo = async (prompt: string, imageBase64?: string) => {
    // 1. Check API Key Selection (Mandatory for Veo)
    if (!window.aistudio?.hasSelectedApiKey) {
        throw new Error("KEY_REQUIRED");
    }
  
  // 2. Create new instance with the user-selected key
  const selectedAi = getAI(true);
  
  let operation;
  const config = {
    numberOfVideos: 1,
    resolution: '720p' as const,
    aspectRatio: '16:9' as const
  };

  try {
    // 3. Launch Generation
    if (imageBase64) {
      operation = await selectedAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: imageBase64,
            mimeType: 'image/jpeg' 
        },
        config: config
      });
    } else {
      operation = await selectedAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: config
      });
    }

    // 4. Polling Loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await selectedAi.operations.getVideosOperation({ operation: operation });
    }

    // 5. Retrieve Video URI
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("La génération a échoué, aucune vidéo retournée.");

    // 6. Fetch the actual MP4 bytes
    const finalVideoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    
    if (!finalVideoResponse.ok) {
        throw new Error(`Erreur téléchargement vidéo: ${finalVideoResponse.statusText}`);
    }

    const videoBlob = await finalVideoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Veo Error:", error);
    throw error;
  }
};

/**
 * Live API: Voice Assistant Connection
 */
export class LiveClient {
    private sessionPromise: Promise<any> | null = null;
    private inputAudioContext: AudioContext | null = null;
    private outputAudioContext: AudioContext | null = null;
    private stream: MediaStream | null = null;
    private processor: ScriptProcessorNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private currentSession: any = null;
    
    constructor(
        private onMessage: (text: string) => void,
        private onTranscript?: (text: string) => void
    ) {}
  
    async connect() {
      const ai = getAI();
  
      // Initialize Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
      this.outputAudioContext = new AudioContextClass({ sampleRate: 24000 });

      // Connect to Gemini Live
      this.sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: async () => {
                console.log("DDR Compagnon connecté.");
                await this.startAudioStream();
            },
            onmessage: async (message: LiveServerMessage) => {
                // Audio Output
                const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData) {
                    await this.playAudio(audioData);
                }

                // Transcription / Text logic
                const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
                if (text) {
                     this.onMessage(text);
                }

                // Handle user transcription
                if (message.serverContent?.inputAudioTranscription) {
                    const transcript = message.serverContent.inputAudioTranscription.text;
                    if (transcript && this.onTranscript) {
                        this.onTranscript(transcript);
                    }
                }
            },
            onclose: () => console.log("Session fermée"),
            onerror: (err) => console.error("Erreur Session:", err)
        },
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: SYSTEM_INSTRUCTION,
            inputAudioTranscription: {},
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
            }
        }
      });
      
      this.currentSession = await this.sessionPromise;
      return this.currentSession;
    }
  
    private async startAudioStream() {
        if (!this.inputAudioContext) return;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Resume context if suspended (browser policy)
            if (this.inputAudioContext.state === 'suspended') {
                await this.inputAudioContext.resume();
            }

            this.source = this.inputAudioContext.createMediaStreamSource(this.stream);
            this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            this.processor.onaudioprocess = (e) => {
                if (!this.currentSession) return;

                const inputData = e.inputBuffer.getChannelData(0);
                // Downsample logic or direct PCM conversion
                const pcmData = this.floatTo16BitPCM(inputData);
                const base64Data = this.arrayBufferToBase64(pcmData.buffer);
                
                this.currentSession.sendRealtimeInput({
                    media: {
                        mimeType: 'audio/pcm;rate=16000',
                        data: base64Data
                    }
                });
            };
            
            this.source.connect(this.processor);
            this.processor.connect(this.inputAudioContext.destination);
        } catch (err) {
            console.error("Erreur d'accès au micro:", err);
            this.disconnect();
            throw err;
        }
    }

    private async playAudio(base64Data: string) {
        if (!this.outputAudioContext) return;
        
        try {
            const binaryString = atob(base64Data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Create buffer
            const audioBuffer = this.outputAudioContext.createBuffer(1, bytes.length / 2, 24000);
            const channelData = audioBuffer.getChannelData(0);
            
            const dataInt16 = new Int16Array(bytes.buffer);
            for (let i = 0; i < dataInt16.length; i++) {
                channelData[i] = dataInt16[i] / 32768.0;
            }

            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.outputAudioContext.destination);
            source.start();
        } catch (e) {
            console.error("Erreur playback audio:", e);
        }
    }

    private floatTo16BitPCM(input: Float32Array) {
        const output = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return output;
    }

    private arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    disconnect() {
        if (this.currentSession) {
            try {
                this.currentSession.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        if (this.source) this.source.disconnect();
        if (this.processor) this.processor.disconnect();

        this.inputAudioContext?.close();
        this.outputAudioContext?.close();

        this.stream = null;
        this.source = null;
        this.processor = null;
        this.inputAudioContext = null;
        this.outputAudioContext = null;
        this.sessionPromise = null;
        this.currentSession = null;
        console.log("DDR Compagnon déconnecté.");
    }
}