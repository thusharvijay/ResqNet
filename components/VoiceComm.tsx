
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, PhoneCall } from 'lucide-react'; // Fix: Removed invalid Waveform and unused Radio
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

// Fix: Implement manual encode/decode for audio processing as per Gemini Live API guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface VoiceCommProps {
  roomId: string;
  roomName: string;
}

const VoiceComm: React.FC<VoiceCommProps> = ({ roomId, roomName }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  // Fix: Use Gemini Live API for real intercom functionality
  const startCall = useCallback(async () => {
    setIsCalling(true);
    setConnectionTime(0);
    nextStartTimeRef.current = 0;
    
    // Start timer for session duration display
    timerRef.current = setInterval(() => {
      setConnectionTime(prev => prev + 1);
    }, 1000);

    // Initialize Audio Contexts for input and output processing
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const inputAudioContext = new AudioCtx({ sampleRate: 16000 });
    const outputAudioContext = new AudioCtx({ sampleRate: 24000 });
    inputAudioContextRef.current = inputAudioContext;
    outputAudioContextRef.current = outputAudioContext;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              if (isMuted) return;
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Process incoming model audio bytes
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              const outCtx = outputAudioContextRef.current;
              if (!outCtx) return;

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                outCtx,
                24000,
                1,
              );
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle model interruption
            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Live API Error:', e),
          onclose: () => console.log('Live API Closed'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are the rescue intercom system for the RESQNET command center. You are speaking to survivors in the room: ${roomName}. Stay calm, professional, and provide guidance based on safety protocols. Encourage them to stay low if there is smoke.`,
        },
      });
    } catch (err) {
      console.error('Failed to start call:', err);
      setIsCalling(false);
    }
  }, [roomName, isMuted]);

  const endCall = useCallback(() => {
    setIsCalling(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Release resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    
    for (const source of sourcesRef.current.values()) {
      try { source.stop(); } catch(e) {}
    }
    sourcesRef.current.clear();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      endCall();
    };
  }, [endCall]);

  return (
    <div className="flex items-center gap-2">
      {isCalling && (
        <div className="px-4 py-2 bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-xl flex items-center gap-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
              Live Intercom: {roomName}
            </span>
            <span className="text-xs font-bold text-white mono">{formatTime(connectionTime)}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg transition-colors ${isMuted ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-gray-400'}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button 
              onClick={endCall}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-600/20"
            >
              Terminate
            </button>
          </div>
        </div>
      )}
      
      {!isCalling && (
        <button 
          onClick={startCall}
          className="group px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:scale-105"
        >
          <PhoneCall className="w-4 h-4" />
          Talk to Room
        </button>
      )}
    </div>
  );
};

export default VoiceComm;
