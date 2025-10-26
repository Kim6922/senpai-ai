
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Modality, Operation, GenerateVideosOperationResponse, GenerateContentResponse } from '@google/genai';
import type { ActiveTab, VoiceOption, ChatMessage, GroundingChunk } from './types';
import { SpiderIcon, UploadIcon, SendIcon, GoogleIcon, FacebookIcon, InstagramIcon, WandIcon, GlobeIcon, LinkIcon, DownloadIcon, D20Icon } from './components/icons';
import { fileToBase64, decode, decodeAudioData, createWavBlob } from './utils/helpers';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

type User = {
  firstName: string;
  lastName: string;
  email: string;
};


const AuthPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSocialLogin = (platform: string) => {
        onLogin({ firstName: platform, lastName: 'User', email: `${platform.toLowerCase()}@example.com` });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginView) {
            // Simulated login
            onLogin({ firstName: email.split('@')[0] || 'User', lastName: '', email });
        } else {
            // Simulated signup
            onLogin({ firstName, lastName, email });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent text-white p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <SpiderIcon className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-glow" />
                    <h1 className="text-5xl md:text-6xl font-bold text-purple-400" style={{ textShadow: '0 0 15px rgba(192, 132, 252, 0.8), 0 0 25px rgba(192, 132, 252, 0.5)'}}>
                        Senpai
                    </h1>
                    <p className="text-gray-400 mt-2">The All-in-One AI Creative Suite</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 space-y-6">
                    <div className="flex gap-4">
                        <button onClick={() => handleSocialLogin('Google')} className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-600 rounded-lg shadow transition-colors">
                            <GoogleIcon className="w-5 h-5" /> Google
                        </button>
                        <button onClick={() => handleSocialLogin('Facebook')} className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-600 rounded-lg shadow transition-colors">
                            <FacebookIcon className="w-5 h-5 text-[#1877F2]" /> Facebook
                        </button>
                         <button onClick={() => handleSocialLogin('Instagram')} className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-600 rounded-lg shadow transition-colors">
                            <InstagramIcon className="w-5 h-5 text-[#E4405F]" /> Instagram
                        </button>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <hr className="flex-grow border-gray-600"/>
                        <span className="px-2">OR</span>
                        <hr className="flex-grow border-gray-600"/>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginView && (
                             <div className="flex gap-4">
                                <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" />
                                <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" />
                            </div>
                        )}
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" />
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                            {isLoginView ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-400">
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-purple-400 hover:text-purple-300 ml-1">
                            {isLoginView ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
                <div className="text-center mt-8">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            alert('The Senpai desktop app is coming soon!');
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 border border-gray-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/20"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        Download The App
                    </a>
                </div>
            </div>
        </div>
    );
};


const Spinner: React.FC<{ message?: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
        {message && <p className="text-purple-300 font-medium text-center">{message}</p>}
    </div>
);

const PaywallOverlay: React.FC<{ onSubscribeClick: () => void }> = ({ onSubscribeClick }) => (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
        <SpiderIcon className="w-16 h-16 text-purple-400 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Unlock Premium Feature</h3>
        <p className="text-gray-400 mb-6 text-center max-w-md">
            To generate videos, movies, and high-quality images, please subscribe to one of our plans.
        </p>
        <button
            onClick={onSubscribeClick}
            className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
        >
            View Plans
        </button>
    </div>
);


const CreativeSuite: React.FC<{ user: User, onLogout: () => void }> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('video');
  const [showPricing, setShowPricing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    const savedSub = localStorage.getItem('senpaiSubscription');
    return savedSub ? JSON.parse(savedSub) : false;
  });
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState<string>('Make the scene cinematic and dramatic.');
  const [sourceVideoFile, setSourceVideoFile] = useState<File | null>(null);
  const [sourceVideoUrl, setSourceVideoUrl] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
  const [videoLoadingMessage, setVideoLoadingMessage] = useState<string>('');
  const [videoError, setVideoError] = useState<string | null>(null);
  
  // TTS State
  const [ttsText, setTtsText] = useState<string>("In the velvet darkness, a web of stories is spun, each thread a possibility, each connection a new world. Welcome to Senpai.");
  const voiceOptions: VoiceOption[] = [
    { name: 'Zephyr (Female)', value: 'Zephyr', group: 'Voice Group 1' },
    { name: 'Puck (Male)', value: 'Puck', group: 'Voice Group 1' },
    { name: 'Kore (Female)', value: 'Kore', group: 'Voice Group 1' },
    { name: 'Umbriel (Female)', value: 'Umbriel', group: 'Voice Group 2' },
    { name: 'Charon (Male)', value: 'Charon', group: 'Voice Group 2' },
    { name: 'Fenrir (Male)', value: 'Fenrir', group: 'Voice Group 2' },
    { name: 'Vindemiatrix (Female)', value: 'Vindemiatrix', group: 'Voice Group 3' },
    { name: 'Rasalgethi (Male)', value: 'Rasalgethi', group: 'Voice Group 3' },
    { name: 'Schedar (Female)', value: 'Schedar', group: 'Voice Group 3' },
    { name: 'Algenib (Male)', value: 'Algenib', group: 'Voice Group 4' },
  ];
  const [selectedVoice, setSelectedVoice] = useState<string>(voiceOptions[0].value);
  const [isTtsLoading, setIsTtsLoading] = useState<boolean>(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Image State
  const [imagePrompt, setImagePrompt] = useState<string>('A spider logo, glowing with purple neon, on a dark, intricate web background.');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isPromptEnhancing, setIsPromptEnhancing] = useState(false);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am Senpai, your creative assistant. How can I help you weave your ideas into reality today?' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Movie State
  const [moviePrompt, setMoviePrompt] = useState<string>('A neon hologram of a spider weaving a glowing web in a futuristic city at night.');
  const [generatedMovieUrl, setGeneratedMovieUrl] = useState<string | null>(null);
  const [isMovieLoading, setIsMovieLoading] = useState<boolean>(false);
  const [movieLoadingMessage, setMovieLoadingMessage] = useState<string>('');
  const [movieError, setMovieError] = useState<string | null>(null);
  const [isScriptWriting, setIsScriptWriting] = useState(false);

  // Music State
  const [musicPrompt, setMusicPrompt] = useState<string>("A rhythmic, moody soundscape with a deep male voice chanting 'deep space' over a synthesized beat.");
  const [isMusicLoading, setIsMusicLoading] = useState<boolean>(false);
  const [generatedMusicAudio, setGeneratedMusicAudio] = useState<string | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [selectedMusicVoice, setSelectedMusicVoice] = useState<string>(voiceOptions[0].value);

  // Sound FX State
  const [soundPrompt, setSoundPrompt] = useState<string>('Laser blast');
  const [isSoundLoading, setIsSoundLoading] = useState<boolean>(false);
  const [generatedSoundAudio, setGeneratedSoundAudio] = useState<string | null>(null);
  const [soundError, setSoundError] = useState<string | null>(null);

  // TTRPG State
  const [ttrpgPrompt, setTtrpgPrompt] = useState<string>('A mysterious, cursed sword found in an ancient tomb.');
  const [ttrpgSystem, setTtrpgSystem] = useState<string>('D&D 5e');
  const [ttrpgType, setTtrpgType] = useState<string>('Magic Item');
  const [isTtrpgLoading, setIsTtrpgLoading] = useState<boolean>(false);
  const [generatedTtrpgContent, setGeneratedTtrpgContent] = useState<string>('');
  const [ttrpgError, setTtrpgError] = useState<string | null>(null);


  const videoLoadingMessages = [
    "Weaving pixels into a digital tapestry...",
    "Consulting with the digital arachnids...",
    "Spinning up the generation engine...",
    "Entangling frames into a new reality...",
    "This can take a few minutes, the spiders are hard at work.",
    "Rendering your vision, one thread at a time...",
  ];
  
  const exampleVideoPrompts = [
    "Turn the subject into a walking skeleton.",
    "Make it look like a vintage 1920s film.",
    "Add a magical, sparkling aura around the main subject.",
    "Change the season from summer to a snowy winter.",
  ];

  const exampleImagePrompts = [
    "A cyberpunk city street at night, rain and neon signs.",
    "Photorealistic portrait of an astronaut spider on the moon.",
    "Oil painting of a tranquil forest with a glowing river.",
    "Logo for 'Senpai' in a minimalist Japanese ink wash style.",
  ];

  const exampleMoviePrompts = [
    "A single long tracking shot through a bustling medieval market.",
    "Time-lapse of a flower blooming, in a psychedelic style.",
    "Epic cinematic trailer for a movie about robot gladiators.",
    "A cute animated character discovering a magical world.",
  ];

  const exampleMusicPrompts = [
    "Epic orchestral soundtrack for a fantasy battle.",
    "Lo-fi hip hop beats, perfect for studying.",
    "Upbeat 8-bit chiptune track for a retro video game.",
    "Calming ambient soundscape with gentle rain.",
  ];

  const exampleSoundPrompts = [
    "A powerful magical spell being cast.",
    "Footsteps of a giant creature in a cave.",
    "A futuristic spaceship door opening.",
    "A glitchy, digital data corruption sound.",
  ];

  const exampleTtrpgPrompts = [
    'A grumpy dwarf barbarian who secretly loves baking.',
    'A city powered by a captured lightning elemental.',
    'A quest to retrieve a stolen dragon\'s egg.',
    'A tavern that exists in multiple dimensions at once.',
  ];

  const gameSystems = ['D&D 5e', 'Pathfinder 2e', 'Cyberpunk RED', 'Call of Cthulhu', 'System Agnostic'];
  const generationTypes = ['Character', 'Location', 'Quest', 'Magic Item', 'Encounter', 'Monster'];

  useEffect(() => {
    localStorage.setItem('senpaiSubscription', JSON.stringify(isSubscribed));
  }, [isSubscribed]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
  }, []);
  
  useEffect(() => {
    let interval: number;
    const loadingState = isVideoLoading || isMovieLoading;
    if (loadingState) {
        const messageSetter = isVideoLoading ? setVideoLoadingMessage : setMovieLoadingMessage;
        messageSetter(videoLoadingMessages[0]);
        interval = window.setInterval(() => {
            messageSetter(prev => {
            const currentIndex = videoLoadingMessages.indexOf(prev);
            return videoLoadingMessages[(currentIndex + 1) % videoLoadingMessages.length];
            });
        }, 4000);
    }
    return () => clearInterval(interval);
  }, [isVideoLoading, isMovieLoading]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceVideoFile(file);
      const url = URL.createObjectURL(file);
      setSourceVideoUrl(url);
      setGeneratedVideoUrl(null);
      setVideoError(null);
    }
  };

  const extractFirstFrameAsBase64 = (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      video.onloadeddata = () => {
        video.currentTime = 0;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(video.src);
          resolve(dataUrl.split(',')[1]);
        } else {
          URL.revokeObjectURL(video.src);
          reject(new Error('Could not get canvas context'));
        }
      };
      video.onerror = (e) => {
        URL.revokeObjectURL(video.src);
        reject(e);
      };
    });
  };

  const handleGenerateVideo = useCallback(async () => {
    if (!sourceVideoFile || !videoPrompt) {
      setVideoError('Please upload a video and enter a prompt.');
      return;
    }
    if (!process.env.API_KEY) {
        setVideoError("API Key is not configured. Please ensure it's set in your environment variables.");
        return;
    }

    setIsVideoLoading(true);
    setVideoError(null);
    setGeneratedVideoUrl(null);

    try {
      const imageBase64 = await extractFirstFrameAsBase64(sourceVideoFile);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      let operation: Operation<GenerateVideosOperationResponse> = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        image: {
          imageBytes: imageBase64,
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
          throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        setGeneratedVideoUrl(URL.createObjectURL(videoBlob));
      } else {
        throw new Error('Video generation did not return a valid video URI.');
      }
    } catch (error: any) {
      console.error('Video generation error:', error);
      if (error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("429")) {
        setVideoError("You've exceeded your API quota. Please check your plan and billing details. For more information, visit the <a href='https://ai.google.dev/gemini-api/docs/rate-limits' target='_blank' rel='noopener noreferrer' class='underline text-purple-400 hover:text-purple-300'>API rate limits documentation</a>.");
      } else {
        setVideoError(`An error occurred: ${error.message}`);
      }
    } finally {
      setIsVideoLoading(false);
    }
  }, [sourceVideoFile, videoPrompt]);

  const handleGenerateTts = useCallback(async () => {
    if (!ttsText) {
      setTtsError('Please enter text to synthesize.');
      return;
    }
    if (!process.env.API_KEY) {
      setTtsError("API Key is not configured. Please ensure it's set in your environment variables to use Text-to-Speech.");
      return;
    }
    setGeneratedAudio(null);
    setIsTtsLoading(true);
    setTtsError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: ttsText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        setGeneratedAudio(base64Audio);
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContextRef.current,
            24000,
            1,
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      } else {
        throw new Error("No audio data received from API.");
      }

    } catch (error: any)
    {
      console.error('TTS generation error:', error);
      setTtsError(`An error occurred: ${error.message}`);
    } finally {
      setIsTtsLoading(false);
    }
  }, [ttsText, selectedVoice]);
  
  const handleDownloadAudio = () => {
    if (!generatedAudio) return;
    const byteArray = decode(generatedAudio);
    const blob = createWavBlob(byteArray, 24000, 1);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'senpai-audio.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
        setImageError('Please enter a prompt to generate an image.');
        return;
    }
    if (!process.env.API_KEY) {
      setImageError("API Key is not configured. Please ensure it's set in your environment variables to use the Image Generator.");
      return;
    }
    setIsImageLoading(true);
    setImageError(null);
    setGeneratedImageUrl(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: imagePrompt,
              },
            ],
          },
          config: {
              responseModalities: [Modality.IMAGE],
          },
        });

        let base64ImageBytes: string | undefined;
        const parts = response?.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData) {
              base64ImageBytes = part.inlineData.data;
              break;
            }
          }
        }
        
        if (base64ImageBytes) {
          setGeneratedImageUrl(`data:image/png;base64,${base64ImageBytes}`);
        } else {
          const textResponse = response.text;
          if (textResponse) {
            throw new Error(`API returned a text response instead of an image: ${textResponse}`);
          }
          throw new Error("Image generation did not return valid image data.");
        }
    } catch (error: any) {
        console.error('Image generation error:', error);
        if (error.message?.includes("billed users")) {
            setImageError("The image generation API is only accessible to billed users. Please check your account status.");
        } else {
            setImageError(`An error occurred: ${error.message}`);
        }
    } finally {
        setIsImageLoading(false);
    }
  };

  const handleEnhanceImagePrompt = async () => {
    if (!imagePrompt) return;
    setIsPromptEnhancing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Enhance the following user prompt for an AI image generator to be more descriptive, vivid, and artistic. Return only the enhanced prompt, without any introductory text. User prompt: "${imagePrompt}"`
      });
      setImagePrompt(response.text.trim());
    } catch (error: any) {
      setImageError(`Failed to enhance prompt: ${error.message}`);
    } finally {
      setIsPromptEnhancing(false);
    }
  };
  
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    if (!process.env.API_KEY) {
        setChatMessages(prev => [...prev, {role: 'model', text: "I can't respond right now. The API Key is not configured."}]);
        return;
    }
    
    const newUserMessage: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    const currentChatInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = isSearchEnabled ? 'gemini-2.5-flash' : 'gemini-2.5-pro';
        
        const history = chatMessages.slice(1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        const contents = [...history, { role: 'user', parts: [{ text: currentChatInput }] }];

        const config: any = isSearchEnabled 
            ? { tools: [{ googleSearch: {} }] } 
            : { systemInstruction: 'You are Senpai, a helpful and creative AI assistant with a slightly mysterious and wise persona, like a guide in a digital world. You help users with their creative projects. You keep your answers concise and helpful.' };

        const stream = await ai.models.generateContentStream({ model, contents, config });
        
        let modelResponseText = '';
        let finalResponse: GenerateContentResponse | null = null;
        setChatMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of stream) {
            modelResponseText += chunk.text;
            finalResponse = chunk;
            setChatMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: modelResponseText };
                return newMessages;
            });
        }
        
        const groundingChunks = finalResponse?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        setChatMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', text: modelResponseText, groundingChunks };
            return newMessages;
        });

    } catch (error: any) {
        console.error('Chat error:', error);
        setChatMessages(prev => [...prev, { role: 'model', text: `Sorry, an error occurred: ${error.message}` }]);
    } finally {
        setIsChatLoading(false);
        setIsSearchEnabled(false);
    }
  };

  const handleGenerateMovie = useCallback(async () => {
    if (!moviePrompt) {
      setMovieError('Please enter a prompt to generate a movie.');
      return;
    }
    if (!process.env.API_KEY) {
        setMovieError("API Key is not configured. Please ensure it's set in your environment variables.");
        return;
    }

    setIsMovieLoading(true);
    setMovieError(null);
    setGeneratedMovieUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation: Operation<GenerateVideosOperationResponse> = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: moviePrompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
          throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        setGeneratedMovieUrl(URL.createObjectURL(videoBlob));
      } else {
        throw new Error('Movie generation did not return a valid video URI.');
      }
    } catch (error: any) {
      console.error('Movie generation error:', error);
      if (error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("429")) {
        setMovieError("You've exceeded your API quota. Please check your plan and billing details. For more information, visit the <a href='https://ai.google.dev/gemini-api/docs/rate-limits' target='_blank' rel='noopener noreferrer' class='underline text-purple-400 hover:text-purple-300'>API rate limits documentation</a>.");
      } else {
        setMovieError(`An error occurred: ${error.message}`);
      }
    } finally {
      setIsMovieLoading(false);
    }
  }, [moviePrompt]);
  
  const handleGenerateScript = async (promptType: 'video' | 'movie') => {
      const prompt = promptType === 'video' ? videoPrompt : moviePrompt;
      if (!prompt) return;
      setIsScriptWriting(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `You are an expert scriptwriter. Based on the following idea, write a short, detailed, and cinematic scene description that can be used as a prompt for an AI video generator. Return only the new prompt. Idea: "${prompt}"`
        });
        if (promptType === 'video') {
            setVideoPrompt(response.text.trim());
        } else {
            setMoviePrompt(response.text.trim());
        }
      } catch (error: any) {
        const setError = promptType === 'video' ? setVideoError : setMovieError;
        setError(`Failed to generate script: ${error.message}`);
      } finally {
          setIsScriptWriting(false);
      }
  };

  const handleGenerateMusic = useCallback(async () => {
    if (!musicPrompt) {
      setMusicError('Please enter a prompt to generate music.');
      return;
    }
    if (!process.env.API_KEY) {
      setMusicError("API Key is not configured. Please ensure it's set in your environment variables.");
      return;
    }
    setGeneratedMusicAudio(null);
    setIsMusicLoading(true);
    setMusicError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Generate a soundscape described as: ${musicPrompt}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedMusicVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        setGeneratedMusicAudio(base64Audio);
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContextRef.current,
            24000,
            1,
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      } else {
        throw new Error("No audio data received from API.");
      }
    } catch (error: any) {
      console.error('Music generation error:', error);
      setMusicError(`An error occurred: ${error.message}`);
    } finally {
      setIsMusicLoading(false);
    }
  }, [musicPrompt, selectedMusicVoice]);

  const handleDownloadMusic = () => {
      if (!generatedMusicAudio) return;
      const byteArray = decode(generatedMusicAudio);
      const blob = createWavBlob(byteArray, 24000, 1);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'senpai-music.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleGenerateSound = useCallback(async () => {
    if (!soundPrompt) {
      setSoundError('Please enter a prompt to generate a sound effect.');
      return;
    }
    if (!process.env.API_KEY) {
      setSoundError("API Key is not configured. Please ensure it's set in your environment variables.");
      return;
    }
    setGeneratedSoundAudio(null);
    setIsSoundLoading(true);
    setSoundError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        // Fix: Simplified the prompt to be more direct for the TTS model. This reduces
        // the likelihood of the model misinterpreting the request as text to be spoken.
        contents: [{ parts: [{ text: `Sound effect of a ${soundPrompt}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }, // Use a default voice
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        setGeneratedSoundAudio(base64Audio);
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContextRef.current,
            24000,
            1,
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      } else {
        // Fix: Added more robust error handling. If audio data is missing,
        // check for and display the model's text response to the user.
        const textResponse = response.text;
        if (textResponse) {
          throw new Error(`Model responded with text instead of audio: "${textResponse.trim()}"`);
        } else {
          throw new Error("No audio data received from API. The model may not be able to generate this sound effect.");
        }
      }
    } catch (error: any) {
      console.error('Sound FX generation error:', error);
      setSoundError(`An error occurred: ${error.message}`);
    } finally {
      setIsSoundLoading(false);
    }
  }, [soundPrompt]);

  const handleDownloadSound = () => {
      if (!generatedSoundAudio) return;
      const byteArray = decode(generatedSoundAudio);
      const blob = createWavBlob(byteArray, 24000, 1);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'senpai-soundfx.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleGenerateTtrpg = useCallback(async () => {
    if (!ttrpgPrompt) {
      setTtrpgError('Please enter a prompt to generate content.');
      return;
    }
    if (!process.env.API_KEY) {
      setTtrpgError("API Key is not configured. Please ensure it's set in your environment variables.");
      return;
    }
    setGeneratedTtrpgContent('');
    setIsTtrpgLoading(true);
    setTtrpgError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const detailedPrompt = `As an expert TTRPG game master for the ${ttrpgSystem} system, create a ${ttrpgType} based on the following idea. Format the output clearly using Markdown, with headings, bold text, and bullet points where appropriate. Idea: "${ttrpgPrompt}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: detailedPrompt,
      });

      setGeneratedTtrpgContent(response.text);

    } catch (error: any) {
      console.error('TTRPG generation error:', error);
      setTtrpgError(`An error occurred: ${error.message}`);
    } finally {
      setIsTtrpgLoading(false);
    }
  }, [ttrpgPrompt, ttrpgSystem, ttrpgType]);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setShowPricing(false);
  };

  const renderVideoGenerator = () => (
    <div className="relative">
      {!isSubscribed && <PaywallOverlay onSubscribeClick={() => setShowPricing(true)} />}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8 ${!isSubscribed ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">1. Upload Source Video</h3>
            <label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800/80 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-10 h-10 mb-3 text-gray-400"/>
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">MP4, MOV, AVI (MAX. 50MB)</p>
              </div>
              <input id="video-upload" type="file" className="hidden" accept="video/*" onChange={handleVideoFileChange} />
            </label>
            {sourceVideoFile && <p className="text-xs text-gray-400 mt-2 truncate">Selected: {sourceVideoFile.name}</p>}
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-purple-300">2. Describe Transformation</h3>
                <button onClick={() => handleGenerateScript('video')} disabled={isScriptWriting || !videoPrompt} className="flex items-center text-sm px-3 py-1 bg-purple-600/50 text-purple-300 rounded-md hover:bg-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <WandIcon className="w-4 h-4 mr-2"/>
                    <span>{isScriptWriting ? 'Writing...' : 'AI Scriptwriter'}</span>
                </button>
            </div>
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="e.g., Change the background to a futuristic city..."
              className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
             <div className="mt-2">
              <p className="text-xs text-gray-400 mb-2">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {exampleVideoPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setVideoPrompt(prompt)}
                    className="text-xs bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 px-2 py-1 rounded-md transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleGenerateVideo} 
            disabled={!sourceVideoFile || !videoPrompt || isVideoLoading}
            className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            {isVideoLoading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
            <span>{isVideoLoading ? 'Weaving Video...' : 'Generate Video'}</span>
          </button>
          {videoError && <p className="text-red-400 text-sm mt-2" dangerouslySetInnerHTML={{ __html: videoError }}></p>}
        </div>
        
        <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-medium text-gray-300">Source Video</h3>
                <div className="aspect-video w-full bg-black rounded-lg border border-gray-700 flex items-center justify-center">
                  {sourceVideoUrl ? <video src={sourceVideoUrl} controls className="w-full h-full rounded-lg" /> : <p className="text-gray-500">Upload a video to see preview</p>}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-medium text-gray-300">Generated Video</h3>
                <div className="aspect-video w-full bg-black rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
                  {isVideoLoading ? <Spinner message={videoLoadingMessage}/> : 
                  generatedVideoUrl ? <video src={generatedVideoUrl} controls autoPlay className="w-full h-full rounded-lg" /> : <p className="text-gray-500">Your generated video will appear here</p>}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderTtsGenerator = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-purple-300">Voice Synthesis</h2>
        <div>
          <label htmlFor="tts-text" className="block text-sm font-medium text-gray-300 mb-2">Text to Synthesize</label>
          <textarea
            id="tts-text"
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            rows={6}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="Enter the text you want to convert to speech..."
          />
        </div>
        <div>
          <label htmlFor="voice-select" className="block text-sm font-medium text-gray-300 mb-2">Select Voice</label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            {Object.entries(voiceOptions.reduce((acc, option) => {
              if (!acc[option.group]) acc[option.group] = [];
              acc[option.group].push(option);
              return acc;
            }, {} as Record<string, VoiceOption[]>)).map(([group, options]) => (
              <optgroup label={group} key={group}>
                {options.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGenerateTts}
              disabled={isTtsLoading}
              className="flex-1 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {isTtsLoading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
              <span>{isTtsLoading ? 'Synthesizing...' : 'Generate & Play'}</span>
            </button>
            {generatedAudio && (
                <button
                onClick={handleDownloadAudio}
                className="flex-1 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                <span>Download Audio</span>
                </button>
            )}
        </div>
        {ttsError && <p className="text-red-400 text-sm mt-2">{ttsError}</p>}
      </div>
    </div>
  );
  
  const renderImageGenerator = () => (
    <div className="relative">
      {!isSubscribed && <PaywallOverlay onSubscribeClick={() => setShowPricing(true)} />}
      <div className={`max-w-4xl mx-auto p-4 md:p-8 ${!isSubscribed ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-purple-300">Describe Your Image</h3>
                    <button onClick={handleEnhanceImagePrompt} disabled={isPromptEnhancing || !imagePrompt} className="flex items-center text-sm px-3 py-1 bg-purple-600/50 text-purple-300 rounded-md hover:bg-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <WandIcon className="w-4 h-4 mr-2"/>
                        <span>{isPromptEnhancing ? 'Enhancing...' : 'Enhance Prompt'}</span>
                    </button>
                </div>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g., A majestic spider queen on a throne of woven moonlight..."
                rows={5}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                    {exampleImagePrompts.map(prompt => (
                    <button
                        key={prompt}
                        onClick={() => setImagePrompt(prompt)}
                        className="text-xs bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 px-2 py-1 rounded-md transition-colors"
                    >
                        {prompt}
                    </button>
                    ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleGenerateImage}
              disabled={isImageLoading}
              className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {isImageLoading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
              <span>{isImageLoading ? 'Weaving Image...' : 'Generate Image'}</span>
            </button>
            {imageError && <p className="text-red-400 text-sm mt-2">{imageError}</p>}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Generated Image</h3>
            <div className="aspect-square w-full bg-black rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
              {isImageLoading ? <Spinner message="Generating your masterpiece..."/> :
               generatedImageUrl ? <img src={generatedImageUrl} alt="Generated art" className="w-full h-full object-contain" /> :
               <div className="text-center text-gray-500">
                  <SpiderIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Your generated image will appear here</p>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-[65vh] flex flex-col">
        <div className="bg-gray-900/50 p-4 rounded-t-lg border border-b-0 border-gray-700 flex-grow overflow-y-auto" ref={chatContainerRef}>
            <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <SpiderIcon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />}
                        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-800/80' : 'bg-gray-800/80'}`}>
                            <p className="text-white whitespace-pre-wrap">{msg.text}</p>
                            {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-700/50">
                                    <h4 className="text-xs text-gray-400 mb-2 font-semibold">Sources:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.groundingChunks.map((chunk, i) => chunk.web && (
                                            <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" key={i} title={chunk.web.title} className="flex items-center max-w-xs bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 text-xs px-2 py-1 rounded-full transition-colors">
                                                <LinkIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                                <span className="truncate">{chunk.web.title || new URL(chunk.web.uri).hostname}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isChatLoading && chatMessages[chatMessages.length-1]?.role !== 'model' && (
                    <div className="flex items-start gap-3">
                        <SpiderIcon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                        <div className="max-w-lg p-3 rounded-lg bg-gray-800/80">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <form onSubmit={handleSendChatMessage} className="flex gap-2 p-4 bg-gray-900/50 border border-t-0 border-gray-700 rounded-b-lg">
            <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Senpai anything..."
                className="flex-grow p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                disabled={isChatLoading}
            />
            <button type="button" onClick={() => setIsSearchEnabled(!isSearchEnabled)} title="Toggle Google Search" className={`p-3 rounded-md transition-colors ${isSearchEnabled ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <GlobeIcon className="w-6 h-6" />
            </button>
            <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="p-3 bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                <SendIcon className="w-6 h-6 text-white" />
            </button>
        </form>
    </div>
  );

  const renderMovieGenerator = () => (
    <div className="relative">
      {!isSubscribed && <PaywallOverlay onSubscribeClick={() => setShowPricing(true)} />}
      <div className={`max-w-4xl mx-auto p-4 md:p-8 ${!isSubscribed ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-purple-300">Describe Your Movie Scene</h3>
                    <button onClick={() => handleGenerateScript('movie')} disabled={isScriptWriting || !moviePrompt} className="flex items-center text-sm px-3 py-1 bg-purple-600/50 text-purple-300 rounded-md hover:bg-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <WandIcon className="w-4 h-4 mr-2"/>
                        <span>{isScriptWriting ? 'Writing...' : 'AI Scriptwriter'}</span>
                    </button>
                </div>
              <textarea
                value={moviePrompt}
                onChange={(e) => setMoviePrompt(e.target.value)}
                placeholder="e.g., An astronaut discovers a glowing, crystalline spider web on Mars..."
                rows={5}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
               <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                    {exampleMoviePrompts.map(prompt => (
                    <button
                        key={prompt}
                        onClick={() => setMoviePrompt(prompt)}
                        className="text-xs bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 px-2 py-1 rounded-md transition-colors"
                    >
                        {prompt}
                    </button>
                    ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleGenerateMovie}
              disabled={isMovieLoading}
              className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {isMovieLoading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
              <span>{isMovieLoading ? 'Directing Movie...' : 'Generate Movie'}</span>
            </button>
            {movieError && <p className="text-red-400 text-sm mt-2" dangerouslySetInnerHTML={{ __html: movieError }}></p>}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Generated Movie</h3>
            <div className="aspect-video w-full bg-black rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
              {isMovieLoading ? <Spinner message={movieLoadingMessage} /> :
               generatedMovieUrl ? <video src={generatedMovieUrl} controls autoPlay className="w-full h-full rounded-lg" /> :
               <div className="text-center text-gray-500">
                  <SpiderIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Your generated movie will appear here</p>
               </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMusicGenerator = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-purple-300">Music & Soundscape Generator</h2>
        <div>
          <label htmlFor="music-prompt" className="block text-sm font-medium text-gray-300 mb-2">Describe the soundscape</label>
          <textarea
            id="music-prompt"
            value={musicPrompt}
            onChange={(e) => setMusicPrompt(e.target.value)}
            rows={6}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="e.g., A slow, mysterious synth melody with a deep male voice humming a low tune..."
          />
           <div className="mt-2">
            <p className="text-xs text-gray-400 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
                {exampleMusicPrompts.map(prompt => (
                <button
                    key={prompt}
                    onClick={() => setMusicPrompt(prompt)}
                    className="text-xs bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 px-2 py-1 rounded-md transition-colors"
                >
                    {prompt}
                </button>
                ))}
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="music-voice-select" className="block text-sm font-medium text-gray-300 mb-2">Select Base Voice</label>
          <select
            id="music-voice-select"
            value={selectedMusicVoice}
            onChange={(e) => setSelectedMusicVoice(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            {Object.entries(voiceOptions.reduce((acc, option) => {
              if (!acc[option.group]) acc[option.group] = [];
              acc[option.group].push(option);
              return acc;
            }, {} as Record<string, VoiceOption[]>)).map(([group, options]) => (
              <optgroup label={group} key={group}>
                {options.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGenerateMusic}
              disabled={isMusicLoading}
              className="flex-1 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {isMusicLoading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
              <span>{isMusicLoading ? 'Composing...' : 'Generate & Play'}</span>
            </button>
            {generatedMusicAudio && (
                <button
                onClick={handleDownloadMusic}
                className="flex-1 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                <span>Download Music</span>
                </button>
            )}
        </div>
        {musicError && <p className="text-red-400 text-sm mt-2">{musicError}</p>}
      </div>
    </div>
  );

  const renderSoundGenerator = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-purple-300">Sound FX Generator</h2>
        <div>
          <label htmlFor="sound-prompt" className="block text-sm font-medium text-gray-300 mb-2">Describe the Sound Effect</label>
          <textarea
            id="sound-prompt"
            value={soundPrompt}
            onChange={(e) => setSoundPrompt(e.target.value)}
            rows={3}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="e.g., A door creaking open, followed by a gust of wind..."
          />
           <div className="mt-2">
            <p className="text-xs text-gray-400 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
                {exampleSoundPrompts.map(prompt => (
                <button
                    key={prompt}
                    onClick={() => setSoundPrompt(prompt)}
                    className="text-xs bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 px-2 py-1 rounded-md transition-colors"
                >
                    {prompt}
                </button>
                ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGenerateSound}
              disabled={isSoundLoading}
              className="flex-1 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {isSoundLoading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
              <span>{isSoundLoading ? 'Generating...' : 'Generate & Play'}</span>
            </button>
            {generatedSoundAudio && (
                <button
                onClick={handleDownloadSound}
                className="flex-1 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                <span>Download Sound FX</span>
                </button>
            )}
        </div>
        {soundError && <p className="text-red-400 text-sm mt-2">{soundError}</p>}
      </div>
    </div>
  );
  
  const renderTtrpgGenerator = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-700 space-y-8">
        <div className="flex items-center gap-4">
            <D20Icon className="w-8 h-8 text-purple-300" />
            <h2 className="text-2xl font-bold text-purple-300">TTRPG Content Generator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ttrpg-system" className="block text-sm font-medium text-gray-300 mb-2">Game System</label>
              <select
                id="ttrpg-system"
                value={ttrpgSystem}
                onChange={(e) => setTtrpgSystem(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                {gameSystems.map(system => <option key={system} value={system}>{system}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ttrpg-type" className="block text-sm font-medium text-gray-300 mb-2">Generation Type</label>
              <select
                id="ttrpg-type"
                value={ttrpgType}
                onChange={(e) => setTtrpgType(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                {generationTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
        </div>

        <div>
          <label htmlFor="ttrpg-prompt" className="block text-sm font-medium text-gray-300 mb-2">Describe Your Idea</label>
          <textarea
            id="ttrpg-prompt"
            value={ttrpgPrompt}
            onChange={(e) => setTtrpgPrompt(e.target.value)}
            rows={4}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="e.g., A thieves' guild that operates out of a floating market..."
          />
           <div className="mt-2">
            <p className="text-xs text-gray-400 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
                {exampleTtrpgPrompts.map(prompt => (
                <button
                    key={prompt}
                    onClick={() => setTtrpgPrompt(prompt)}
                    className="text-xs bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 px-2 py-1 rounded-md transition-colors"
                >
                    {prompt}
                </button>
                ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateTtrpg}
          disabled={isTtrpgLoading}
          className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          {isTtrpgLoading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
          <span>{isTtrpgLoading ? 'Rolling the Dice...' : 'Generate Content'}</span>
        </button>

        {ttrpgError && <p className="text-red-400 text-sm mt-2">{ttrpgError}</p>}

        { (isTtrpgLoading || generatedTtrpgContent) && (
            <div className="border-t border-gray-700 pt-6">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">Generated Content</h3>
                <div className="w-full bg-gray-800/50 rounded-lg border border-gray-700 p-4 min-h-[200px] max-h-[50vh] overflow-y-auto">
                {isTtrpgLoading ? 
                    <Spinner message="Crafting your adventure..."/> : 
                    <div className="text-white whitespace-pre-wrap prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: generatedTtrpgContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }}></div>
                }
                </div>
            </div>
        )}
      </div>
    </div>
  );

  const renderPricingModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowPricing(false)}>
        <div className="bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/10 w-full max-w-4xl p-8 m-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">Unlock Your Creativity</h2>
            <p className="text-center text-gray-400 mb-8">Choose a plan that fits your needs.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                {/* Plan 1 */}
                <div className="border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center bg-gray-900/50">
                    <h3 className="text-xl font-semibold mb-2">Monthly</h3>
                    <p className="text-4xl font-bold mb-4">$1<span className="text-lg font-normal text-gray-400">/month</span></p>
                    <button onClick={handleSubscribe} className="w-full mt-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Choose Plan</button>
                </div>
                {/* Plan 2 - Featured */}
                <div className="border-2 border-purple-500 rounded-lg p-6 flex flex-col items-center text-center bg-gray-900/50 relative">
                    <div className="absolute -top-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                    <h3 className="text-xl font-semibold mb-2">Annual</h3>
                    <p className="text-4xl font-bold mb-4">$10<span className="text-lg font-normal text-gray-400">/year</span></p>
                    <p className="text-sm text-green-400 mb-4">2 months free!</p>
                    <button onClick={handleSubscribe} className="w-full mt-auto bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Choose Plan</button>
                </div>
                {/* Plan 3 */}
                <div className="border border-gray-700 rounded-lg p-6 flex flex-col items-center text-center bg-gray-900/50">
                    <h3 className="text-xl font-semibold mb-2">Lifetime</h3>
                    <p className="text-4xl font-bold mb-4">$20<span className="text-lg font-normal text-gray-400">/unlimited</span></p>
                    <button onClick={handleSubscribe} className="w-full mt-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Choose Plan</button>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-700">
                <button onClick={handleSubscribe} className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    <GoogleIcon className="w-6 h-6" />
                    Login with Google
                </button>
            </div>
            <div className="text-center text-xs text-gray-500 mt-6">
                For payment support or inquiries, please contact: mohmmadtaha5216@gmail.com
            </div>
        </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'video': return renderVideoGenerator();
      case 'tts': return renderTtsGenerator();
      case 'image': return renderImageGenerator();
      case 'chat': return renderChat();
      case 'movie': return renderMovieGenerator();
      case 'music': return renderMusicGenerator();
      case 'sound': return renderSoundGenerator();
      case 'ttrpg': return renderTtrpgGenerator();
      default: return renderVideoGenerator();
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-sans">
       {showPricing && renderPricingModal()}
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center gap-4">
                <SpiderIcon className="w-10 h-10 text-purple-400" />
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Senpai
                </h1>
            </div>
            <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded-lg shadow transition-colors flex items-center gap-2">
                    {user.firstName}
                    <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                        <div className="p-2">
                             <div className="px-2 py-1 text-xs text-gray-400">
                                {isSubscribed ? (
                                    <span className="text-green-400">Subscribed</span>
                                ) : (
                                    <span className="text-yellow-400">Not Subscribed</span>
                                )}
                            </div>
                             {!isSubscribed && (
                                <button onClick={() => { setShowPricing(true); setShowUserMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 rounded">
                                    Subscribe
                                </button>
                             )}
                            <button onClick={() => { onLogout(); setShowUserMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 rounded">
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
        <p className="text-center text-gray-400 mb-8 -mt-2">The All-in-One AI Creative Suite</p>

        <div className="overflow-x-auto">
            <div className="flex justify-center mb-8 border-b border-gray-700 whitespace-nowrap">
                {([
                    { key: 'video', label: 'Video' },
                    { key: 'tts', label: 'Voice' },
                    { key: 'image', label: 'Image' },
                    { key: 'chat', label: 'Chat' },
                    { key: 'movie', label: 'Movie' },
                    { key: 'music', label: 'Music' },
                    { key: 'sound', label: 'Sound FX' },
                    { key: 'ttrpg', label: 'TTRPG' },
                ] as {key: ActiveTab, label: string}[]).map(({ key, label }) => (
                    <button 
                    key={key}
                    onClick={() => setActiveTab(key)} 
                    className={`py-3 px-4 sm:px-6 text-base sm:text-lg font-medium transition-colors duration-300 ${activeTab === key ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                    {label}
                    </button>
                ))}
            </div>
        </div>
        
        <main className="min-h-[60vh] flex flex-col justify-center">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('senpaiUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLogin = (userData: User) => {
        localStorage.setItem('senpaiUser', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('senpaiUser');
        localStorage.removeItem('senpaiSubscription'); // Also clear subscription on logout
        setUser(null);
    };

    if (!user) {
        return <AuthPage onLogin={handleLogin} />;
    }

    return <CreativeSuite user={user} onLogout={handleLogout} />;
};


export default App;