// src/components/store/VoiceServices.tsx
'use client';
import { useRef, useState, useEffect } from 'react';

interface VoiceServiceProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useVoiceService = ({ messages, setMessages, input, handleInputChange }: VoiceServiceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // Use a ref for chunks to ensure we have the latest data
  const chunksRef = useRef<Blob[]>([]);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [voiceChatStatus, setVoiceChatStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transcribedText, setTranscribedText] = useState("");
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [voiceId, setVoiceId] = useState('Fritz-PlayAI');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlayingResponse(false);
        if (isVoiceChatActive && voiceChatStatus === 'speaking') {
          setVoiceChatStatus('idle');
          setTimeout(() => {
            startVoiceChatListening();
          }, 500);
        }
      };
    }
    
    return () => {
      if (audioRef.current) {
        const currentSrc = audioRef.current.src;
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load(); 

        if (currentSrc && currentSrc.startsWith('blob:')) {
          URL.revokeObjectURL(currentSrc);
        }
      }
      
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        
        if (mediaRecorder.stream) {
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
      }
      
      localStorage.removeItem('lastInteractionWasVoice');
    };
  }, [isVoiceChatActive, voiceChatStatus, mediaRecorder]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.isLoading) {
      if (localStorage.getItem('lastInteractionWasVoice') === 'true') {
        convertTextToSpeech(lastMessage.content);
        localStorage.removeItem('lastInteractionWasVoice');
      }
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Clear chunks at the start of recording
      chunksRef.current = [];
      
      // Create recorder with specific MIME type
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      });
      setMediaRecorder(recorder);
      
      recorder.ondataavailable = (e) => {
        console.log("Data available event, size:", e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("MediaDevices or getUserMedia not supported in this browser");
        return;
      }      
      
      recorder.onstop = async () => {
        setIsRecording(false);
        
        try {
          console.log("Chunks collected:", chunksRef.current.length);
          if (chunksRef.current.length === 0) {
            console.error("No audio data collected");
            setIsProcessingVoice(false);
            return;
          }
        
          setIsProcessingVoice(true);
          const audioBlob = new Blob(chunksRef.current, { 
            type: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg' 
          });
          
          const formData = new FormData();
          formData.append('audio', audioBlob);
          
          console.log("Sending audio data, size:", audioBlob.size);
          
          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server returned ${response.status}: ${errorText}`);
            throw new Error(`Server error: ${response.status}`);
          }
          
          // Get response as text first
          const responseText = await response.text();
          console.log("API Response preview:", responseText.substring(0, 100));
          
          let result;
          try {
            result = JSON.parse(responseText);
          } catch (jsonError) {
            console.error("Invalid JSON response:", jsonError);
            
            // Try to extract valid JSON if possible
            const jsonMatch = responseText.match(/(\{[\s\S]*\})/g);
            if (jsonMatch) {
              try {
                result = JSON.parse(jsonMatch[0]);
              } catch (extractError) {
                console.error("Failed to extract JSON:", extractError);
                throw new Error("Server returned invalid response format");
              }
            } else {
              throw new Error("Server returned invalid response format");
            }
          }
          
          if (result.text && result.text.trim()) {
            const syntheticEvent = {
              target: { value: result.text }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            
            handleInputChange(syntheticEvent);
            localStorage.setItem('lastInteractionWasVoice', 'true');
          } else {
            alert("Sorry, I couldn't understand what you said. Please try again.");
          }
        } catch (error) {
          console.error("Error processing voice:", error);
          alert("Error processing your voice input. Please try again.");
        } finally {
          setIsProcessingVoice(false);
        }
      };
      
      // Start recording with shorter timeslice to get more frequent data chunks
      recorder.start(500);
      setIsRecording(true);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access your microphone. Please check your browser permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const startVoiceChat = async () => {
    setIsVoiceChatActive(true);
    setVoiceChatStatus('idle');
    setConversationHistory([]);
    
    const welcomeMessage = "Welcome to voice chat mode. I'm listening. What can I help you with regarding your career?";
    setConversationHistory([{ role: 'assistant', content: welcomeMessage }]);
    
    await convertTextToSpeech(welcomeMessage);
    startVoiceChatListening();
  };
  
  const endVoiceChat = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    if (audioRef.current) {
      const currentSrc = audioRef.current.src;
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load(); 
      if (currentSrc && currentSrc.startsWith('blob:')) {
        URL.revokeObjectURL(currentSrc);
      }
    }
    
    const voiceChatMessages = conversationHistory.map((msg, index) => ({
      id: `voice-chat-${index}`,
      role: msg.role,
      content: msg.content
    }));
    
    if (voiceChatMessages.length > 1) {
      setMessages([...messages, ...voiceChatMessages.slice(1).map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system" | "data",
        content: msg.content
      }))]);
    }
    
    setIsVoiceChatActive(false);
    setVoiceChatStatus('idle');
    setTranscribedText("");
    setIsPlayingResponse(false);
    setMediaRecorder(null);
    chunksRef.current = [];
    localStorage.removeItem('lastInteractionWasVoice');
  };
  
  const startVoiceChatListening = async () => {
    setVoiceChatStatus('listening');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Clear chunks and use ref for reliable access
      chunksRef.current = [];
      
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      });
      setMediaRecorder(recorder);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      // In the recorder.onstop function in startVoiceChatListening method
      recorder.onstop = async () => {
        try {
          if (chunksRef.current.length === 0) {
            console.error("No audio data collected");
            setVoiceChatStatus('idle');
            setTimeout(() => {
              if (isVoiceChatActive) {
                startVoiceChatListening();
              }
            }, 500);
            return;
          }
          
          const audioBlob = new Blob(chunksRef.current, { 
            type: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg' 
          });
          
          // Make sure the blob is not empty
          if (audioBlob.size === 0) {
            console.error("Empty audio blob created");
            setVoiceChatStatus('idle');
            setTimeout(() => {
              if (isVoiceChatActive) {
                startVoiceChatListening();
              }
            }, 500);
            return;
          }
          
          console.log(`Processing audio blob: size=${audioBlob.size} bytes, type=${audioBlob.type}`);
          
          const formData = new FormData();
          formData.append('audio', audioBlob);
          
          setVoiceChatStatus('processing');
          
          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
          });
          
          // Enhanced error handling for server errors
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server error (${response.status}): ${errorText}`);
            
            // Parse the error response if possible
            let errorResponse;
            try {
              errorResponse = JSON.parse(errorText);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              // If it's not valid JSON, use the raw text
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              errorResponse = { error: errorText };
            }
            
            // Only proceed if voice chat is still active
            if (isVoiceChatActive) {
              const errorMessage = "I encountered an issue with voice recognition. Let's try again.";
              setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
              
              setVoiceChatStatus('speaking');
              await convertTextToSpeech(errorMessage);
            }
            return;
          }
          
          // Safely handle JSON parsing
          let result;
          try {
            // First try to parse as JSON directly
            const responseText = await response.text();
            result = JSON.parse(responseText);
          } catch (jsonError) {
            console.error("Invalid JSON response:", jsonError);
            
            if (isVoiceChatActive) {
              const errorMessage = "I couldn't process your speech. Let's try again.";
              setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
              
              setVoiceChatStatus('speaking');
              await convertTextToSpeech(errorMessage);
            }
            return;
          }
          
          // Check if we have text from the speech recognition
          if (result && result.text && result.text.trim()) {
            const transcribedText = result.text.trim();
            console.log("Transcribed text:", transcribedText);
            
            // Only proceed if voice chat is still active
            if (isVoiceChatActive) {
              // Add user's transcribed text to conversation history
              setConversationHistory(prev => [...prev, { role: 'user', content: transcribedText }]);
              
              // Prepare API request for chat response
              const chatMessages = [
                ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
                { role: 'user', content: transcribedText }
              ];
              
              try {
                const chatResponse = await fetch('/api/chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ messages: chatMessages }),
                });
                
                if (!chatResponse.ok) {
                  throw new Error(`Chat API error: ${chatResponse.status}`);
                }
                
                const chatResult = await chatResponse.json();
                const assistantResponse = chatResult.text || chatResult.content || 
                  "I'm sorry, I couldn't generate a response. Let's try again.";
                
                // Only proceed if voice chat is still active
                if (isVoiceChatActive) {
                  // Add assistant response to conversation
                  setConversationHistory(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
                  
                  // Speak the response
                  setVoiceChatStatus('speaking');
                  await convertTextToSpeech(assistantResponse);
                }
              } catch (chatError) {
                console.error("Error getting chat response:", chatError);
                
                if (isVoiceChatActive) {
                  const errorMessage = "I had trouble processing your question. Let's try again.";
                  setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
                  
                  setVoiceChatStatus('speaking');
                  await convertTextToSpeech(errorMessage);
                }
              }
            }
          } else {
            console.warn("No transcribed text returned or empty text");
            
            if (isVoiceChatActive) {
              const errorMessage = "I didn't catch what you said. Could you please speak again?";
              setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
              
              setVoiceChatStatus('speaking');
              await convertTextToSpeech(errorMessage);
            }
          }
        } catch (error) {
          console.error("Error in voice chat processing:", error);
          
          if (isVoiceChatActive) {
            const errorMessage = "Sorry, I encountered an error. Let's try again.";
            setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
            
            setVoiceChatStatus('speaking');
            await convertTextToSpeech(errorMessage);
          }
        }
      };
      
      // Start with shorter timeslice for more frequent chunks
      recorder.start(500);

      setTimeout(() => {
        if (recorder.state === 'recording') {
          stopVoiceChatListening();
        }
      }, 10000);
      
    } catch (error) {
      console.error("Error accessing microphone for voice chat:", error);
      setVoiceChatStatus('idle');
      
      const errorMessage = "I couldn't access your microphone. Please check your browser permissions.";
      setConversationHistory([...conversationHistory, { role: 'assistant', content: errorMessage }]);
      
      await convertTextToSpeech(errorMessage);
    }
  };
  
  const stopVoiceChatListening = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const convertTextToSpeech = async (text: string) => {
    try {
      setIsPlayingResponse(true);
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: voiceId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          setIsPlayingResponse(false);
          
          if (isVoiceChatActive) {
            setVoiceChatStatus('idle');
            setTimeout(() => {
              startVoiceChatListening();
            }, 500);
          }
        });
      }
    } catch (error) {
      console.error("Error converting text to speech:", error);
      setIsPlayingResponse(false);
      
      if (isVoiceChatActive) {
        setVoiceChatStatus('idle');
        setTimeout(() => {
          startVoiceChatListening();
        }, 500);
      }
    }
  };
  
  const playLatestResponse = () => {
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    if (assistantMessages.length > 0) {
      const latestResponse = assistantMessages[assistantMessages.length - 1].content;
      convertTextToSpeech(latestResponse);
    }
  };
  
  const stopAudioPlayback = () => {
    if (audioRef.current) {
      const currentSrc = audioRef.current.src;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      if (currentSrc && currentSrc.startsWith('blob:')) {
        URL.revokeObjectURL(currentSrc);
      }
      
      setIsPlayingResponse(false);
      
      if (isVoiceChatActive && voiceChatStatus === 'speaking') {
        setVoiceChatStatus('idle');
        setTimeout(() => {
          startVoiceChatListening();
        }, 500);
      }
    }
  };

  return {
    isRecording,
    isProcessingVoice,
    isPlayingResponse,
    isVoiceChatActive,
    voiceChatStatus,
    conversationHistory,
    setVoiceChatStatus,
    startRecording,
    stopRecording,
    startVoiceChat,
    endVoiceChat,
    startVoiceChatListening,
    stopVoiceChatListening,
    playLatestResponse,
    stopAudioPlayback
  };
};

export default useVoiceService;