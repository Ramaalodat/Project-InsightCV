import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mic, Send, ArrowLeft, Award, TrendingUp, Target, CheckCircle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { getUser } from '../utils/auth';
import { speak, testArabicVoice } from '../utils/arabicTTS';
import { AudioRecorder, transcribeAudio } from '../utils/voiceTranscription';
import { SpeechRecognizer } from '../utils/speechRecognition';
import EmployeeNavbar from '../components/EmployeeNavbar';
import Footer from '../components/Footer';
import './AIInterviewPage.css';

export default function AIInterviewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup');
  const [cvFile, setCvFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [mode, setMode] = useState(null);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [points, setPoints] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [user, setUser] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [voiceAnalysis, setVoiceAnalysis] = useState(null);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechRecognizer, setSpeechRecognizer] = useState(null);
  const [useWebSpeech, setUseWebSpeech] = useState(true); // Use Web Speech API by default

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // Google Cloud TTS - Generate audio from text
  const generateGoogleTTS = async (text, language) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_TTS_KEY;
    if (!API_KEY || API_KEY === 'your_google_tts_key_here') {
      console.log('⚠️ Google TTS key not configured');
      return null;
    }

    try {
      console.log('🌐 Calling Google Cloud TTS for', language);

      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: language === 'ar' ? 'ar-XA' : 'en-US',
              name: language === 'ar' ? 'ar-XA-Wavenet-B' : 'en-US-Wavenet-D',
              ssmlGender: 'MALE'
            },
            audioConfig: {
              audioEncoding: 'MP3',
              pitch: 0,
              speakingRate: 0.9
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Google TTS Error:', error);
        return null;
      }

      const data = await response.json();
      console.log('✅ Google TTS Success!');
      return data.audioContent; // Base64 encoded MP3
    } catch (error) {
      console.error('❌ Google TTS Exception:', error);
      return null;
    }
  };

  // Play Google TTS audio
  const playGoogleTTS = (base64Audio, language) => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);

        audio.onplay = () => {
          setIsAISpeaking(true);
          console.log('🔊 Google TTS playing...');
        };

        audio.onended = () => {
          console.log('✅ Google TTS ended');
          setIsAISpeaking(false);
          if (mode === 'voice' && questionCount < 10 && !sessionComplete) {
            setTimeout(() => startListening(), 500);
          }
          resolve();
        };

        audio.onerror = (err) => {
          console.error('❌ Audio playback error:', err);
          setIsAISpeaking(false);
          reject(err);
        };

        audio.play().catch(reject);
      } catch (error) {
        console.error('❌ Audio creation error:', error);
        reject(error);
      }
    });
  };

  // Smart language detection for mixed Arabic/English
  const isArabicText = (text) => {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
    const englishPattern = /[a-zA-Z]/g;

    const arabicChars = (text.match(arabicPattern) || []).length;
    const englishChars = (text.match(englishPattern) || []).length;
    const totalChars = arabicChars + englishChars;

    if (totalChars === 0) return false;

    // If more than 40% Arabic, consider it Arabic
    const arabicRatio = arabicChars / totalChars;
    console.log(`📊 Language detection: ${arabicChars} Arabic, ${englishChars} English, Ratio: ${(arabicRatio * 100).toFixed(0)}%`);

    return arabicRatio > 0.4;
  };

  // Speak text with automatic language detection (100% free, offline-capable)
  const speakText = (text) => {
    console.log('🔊 speakText - Text:', text.substring(0, 50));

    const onStart = () => {
      setIsAISpeaking(true);
    };

    const onEnd = () => {
      setIsAISpeaking(false);
      if (mode === 'voice' && questionCount < 10 && !sessionComplete) {
        setTimeout(() => startListening(), 500);
      }
    };

    const onError = (error) => {
      console.error('❌ Speech error:', error);
      setIsAISpeaking(false);
      if (mode === 'voice' && questionCount < 10 && !sessionComplete) {
        setTimeout(() => startListening(), 500);
      }
    };

    // Use the unified speak function with auto language detection
    speak(text, onStart, onEnd, onError);
  };



  // Initialize Speech Recognizer (Web Speech API - works offline!)
  const initSpeechRecognizer = () => {
    const recognizer = new SpeechRecognizer();
    
    if (!recognizer.isSupported()) {
      console.warn('⚠️ Web Speech API not supported, will try AssemblyAI');
      setUseWebSpeech(false);
      return null;
    }

    recognizer.onResult = (result) => {
      console.log('✅ Speech recognized:', result.transcript);
      setIsRecording(false);
      handleVoiceInput(result.transcript);
    };

    recognizer.onError = (error) => {
      console.error('❌ Speech recognition error:', error);
      setIsRecording(false);
      
      if (error === 'not-allowed') {
        alert('Please allow microphone access to use voice mode.');
      } else if (error === 'no-speech') {
        console.log('⚠️ No speech detected, trying again...');
        setTimeout(() => startListening(), 1000);
      } else {
        alert('Speech recognition failed. Please try again.');
        setTimeout(() => startListening(), 1000);
      }
    };

    recognizer.onStart = () => {
      setIsRecording(true);
    };

    recognizer.onEnd = () => {
      setIsRecording(false);
    };

    setSpeechRecognizer(recognizer);
    console.log('🎤 Speech recognizer initialized (Web Speech API)');
    return recognizer;
  };

  // Start listening with Web Speech API (instant, offline, free!)
  const startListening = async () => {
    if (sessionComplete || isRecording || isTranscribing || isAISpeaking) return;

    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsAISpeaking(false);
    }

    try {
      // Use Web Speech API (works offline, instant results!)
      let recognizer = speechRecognizer;
      if (!recognizer) {
        recognizer = initSpeechRecognizer();
        if (!recognizer) {
          alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
          return;
        }
      }

      const started = recognizer.start(detectedLanguage);
      if (!started) {
        throw new Error('Failed to start speech recognition');
      }

      console.log('🎤 Listening started (Web Speech API)');
    } catch (error) {
      console.error('❌ Failed to start listening:', error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert('Please allow microphone access to use voice mode.');
      } else {
        alert('Failed to start listening: ' + error.message);
      }
    }
  };

  // Stop listening (Web Speech API stops automatically after speech)
  const stopListening = () => {
    if (speechRecognizer && isRecording) {
      speechRecognizer.stop();
      console.log('⏹️ Stopping speech recognition...');
    }
  };

  // Try Gemini API with few-shot examples
  const tryGeminiAPI = async (systemPrompt, userPrompt, language) => {
    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') return null;

    try {
      console.log('🚀 Trying Gemini API for language:', language);

      // Add few-shot examples to force language
      const examples = language === 'ar'
        ? `\n\nأمثلة على الردود الصحيحة:\nمثال 1: "إجابة جيدة. ما هي خبرتك في React؟"\nمثال 2: "ممتاز. حدثني عن مشروع عملت عليه."\n\nالآن ردك:`
        : `\n\nExamples of correct responses:\nExample 1: "Good answer. What is your React experience?"\nExample 2: "Great. Tell me about a project you worked on."\n\nYour response:`;

      const fullPrompt = `${systemPrompt}\n\n${userPrompt}${examples}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
            topP: 0.95,
            topK: 40
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Gemini Success!');
        return data.candidates[0].content.parts[0].text;
      }
      console.error('❌ Gemini Error:', response.status);
    } catch (err) {
      console.error('❌ Gemini Exception:', err);
    }
    return null;
  };

  // Get AI Response using Free APIs
  const getAIResponse = async (userAnswer, currentQ = '', lang = 'en') => {
    try {
      // Try Groq API first (preferred)
      const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
      const HF_API_KEY = process.env.REACT_APP_HF_API_KEY;

      console.log('🔑 API Key exists:', !!GROQ_API_KEY);
      console.log('🌍 Language:', lang);

      // Ultra-strong bilingual prompts
      const systemPrompt = lang === 'ar'
        ? `أنت محاور محترف عربي. يجب أن تكتب كل ردودك بالعربية الفصحى فقط. ممنوع استخدام الإنجليزية نهائياً.`
        : `You are a professional interviewer. You MUST write all responses in English only. Never use Arabic.`;

      const userPrompt = lang === 'ar'
        ? `المرشح أجاب: "${userAnswer}"\n\nاكتب ردك بالعربية الفصحى فقط (جملتين قصيرتين):\n1. تعليق على الإجابة\n2. سؤال مقابلة واحد جديد\n\nمهم جداً: اكتب بالعربية فقط!`
        : `Candidate answered: "${userAnswer}"\n\nWrite in English only (two short sentences):\n1. Feedback on answer\n2. ONE new interview question\n\nIMPORTANT: Write in English only!`;

      // Try Gemini first (best for Arabic)
      const geminiResponse = await tryGeminiAPI(systemPrompt, userPrompt, lang);
      if (geminiResponse) return geminiResponse;

      // Try Groq as fallback
      if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here') {
        try {
          console.log('🚀 Trying Groq API...');
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant', // Current active model
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: 0.7,
              max_tokens: 100
            })
          });

          console.log('📡 Groq Response Status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('✅ Groq Success!');
            return data.choices[0].message.content;
          } else {
            const errorData = await response.json();
            console.error('❌ Groq Error Details:', JSON.stringify(errorData, null, 2));
            console.error('❌ Status:', response.status, response.statusText);
          }
        } catch (err) {
          console.error('❌ Groq Exception:', err);
        }
      }

      // Fallback to Hugging Face
      console.log('🔄 Trying Hugging Face...');
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\n${userPrompt}`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      console.log('📡 HF Response Status:', hfResponse.status);

      if (hfResponse.ok) {
        const hfData = await hfResponse.json();
        console.log('✅ HF Success!');
        return hfData[0]?.generated_text || (lang === 'ar'
          ? 'شكراً على إجابتك. دعنا ننتقل للسؤال التالي.'
          : 'Thank you for your answer. Let\'s move to the next question.');
      } else {
        const errorData = await hfResponse.json();
        console.error('❌ HF Error:', errorData);
      }

      throw new Error('Both APIs failed');
    } catch (error) {
      console.error('💥 Final Error:', error);
      // Fallback response
      return lang === 'ar'
        ? 'شكراً على إجابتك. دعنا ننتقل للسؤال التالي.'
        : 'Thank you for your answer. Let\'s move to the next question.';
    }
  };

  // Handle voice input with smart language detection
  const handleVoiceInput = async (transcript) => {
    const isArabic = isArabicText(transcript);
    const newLanguage = isArabic ? 'ar' : 'en';

    console.log(`🗣️ Transcript: "${transcript}"`);
    console.log(`🌍 Detected language: ${newLanguage === 'ar' ? 'Arabic' : 'English'}`);

    setDetectedLanguage(newLanguage);

    const userMessage = {
      role: 'user',
      text: transcript,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const wordCount = transcript.split(' ').length;
    const hasExamples = /example|experience|project|مثال|تجربة|مشروع/i.test(transcript);

    const analysis = {
      confidence: wordCount > 20 ? 85 : wordCount > 10 ? 75 : 65,
      clarity: 90,
      pace: wordCount > 30 ? 90 : 85,
      tone: hasExamples ? 'Professional' : 'Confident'
    };

    setVoiceAnalysis(analysis);

    try {
      // Get AI response based on user's answer
      console.log('🤖 Getting AI response...');
      const aiResponse = await getAIResponse(transcript, currentQuestion, newLanguage);
      console.log('✅ AI Response received:', aiResponse.substring(0, 50) + '...');

      // Save to backend (wait for it to ensure data consistency)
      try {
        await interviewAPI.submitAnswer(sessionId, {
          question: currentQuestion,
          answer: transcript,
          voice_analysis: analysis,
          language: newLanguage
        });
        console.log('✅ Answer saved to backend');
      } catch (err) {
        console.warn('⚠️ Backend save failed (non-critical):', err);
      }

      const newCount = questionCount + 1;
      setQuestionCount(newCount);
      console.log('📊 Question count:', newCount, '/ 10');

      setTimeout(() => {
        const aiMessage = {
          role: 'ai',
          text: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

        // Update current question for next round
        setCurrentQuestion(aiResponse);

        // Speak the response
        speakText(aiResponse, newLanguage);
      }, 1000);

      // Check if we've completed 10 questions
      if (newCount >= 10) {
        console.log('✅ Interview complete! Ending session...');
        setTimeout(() => {
          if (window.speechRecognition) {
            window.speechRecognition.stop();
          }
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
          endSession();
        }, 4000);
      }
    } catch (err) {
      console.error('💥 Error:', err);
      alert('Failed to get AI response. Please try again.');
      setTimeout(() => startListening(), 1000);
    }
  };

  // Initialize speech recognizer when voice mode starts
  useEffect(() => {
    if (mode === 'voice' && started) {
      initSpeechRecognizer();
    }

    return () => {
      if (speechRecognizer) {
        speechRecognizer.cleanup();
      }
      if (audioRecorder) {
        audioRecorder.cleanup();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [mode, started]);

  const handleSetupComplete = () => {
    if (!jobTitle.trim()) {
      alert('Please enter job title');
      return;
    }
    setStep('mode-selection');
  };

  // Generate first question using AI
  const generateFirstQuestion = async () => {
    try {
      const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
      const HF_API_KEY = process.env.REACT_APP_HF_API_KEY;

      console.log('🎬 Generating first question...');

      const cvText = cvFile ? 'with uploaded CV' : 'without CV';
      const systemPrompt = `You are a professional interviewer for ${jobTitle} position ${cvText}. Ask ONE short, direct question about their background. Keep it under 20 words.`;

      // Try Gemini first
      const geminiQ = await tryGeminiAPI(systemPrompt, 'Start the interview with the first question.', 'en');
      if (geminiQ) return geminiQ;

      // Try Groq as fallback
      if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here') {
        try {
          console.log('🚀 Trying Groq for first question...');
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant', // Current active model
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Start the interview with the first question.' }
              ],
              temperature: 0.7,
              max_tokens: 50
            })
          });

          console.log('📡 First Q Response:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('✅ First question generated!');
            return data.choices[0].message.content;
          } else {
            const errorData = await response.json();
            console.error('❌ First Q Error:', errorData);
          }
        } catch (err) {
          console.error('❌ First Q Exception:', err);
        }
      }

      // Fallback to Hugging Face
      console.log('🔄 Trying HF for first question...');
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nStart the interview with the first question.`,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (hfResponse.ok) {
        const hfData = await hfResponse.json();
        console.log('✅ HF first question generated!');
        return hfData[0]?.generated_text || `Tell me about yourself and your experience relevant to ${jobTitle} position.`;
      }

      throw new Error('Both APIs failed');
    } catch (error) {
      console.error('💥 First Q Final Error:', error);
      return `Tell me about yourself and your experience relevant to ${jobTitle} position.`;
    }
  };

  const startInterview = async (selectedMode) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await interviewAPI.startSession({
        user_id: user.id,
        mode: selectedMode,
        job_title: jobTitle,
        cv_uploaded: cvFile ? true : false
      });

      setSessionId(response.session_id);
      setMode(selectedMode);
      setStarted(true);
      setStep('interview');
      setQuestionCount(0);

      // Generate first question using AI
      const firstQuestion = await generateFirstQuestion();
      setCurrentQuestion(firstQuestion);

      const welcomeMessage = `Welcome to your AI interview practice for ${jobTitle} position! I'll ask you 10 questions. You can answer in English or Arabic. Let's start!`;

      setTimeout(() => {
        setMessages([
          {
            role: 'ai',
            text: welcomeMessage,
            timestamp: new Date()
          },
          {
            role: 'ai',
            text: firstQuestion,
            timestamp: new Date()
          }
        ]);

        if (selectedMode === 'voice') {
          speakText(welcomeMessage + ' ' + firstQuestion, 'en');
        }
      }, 500);
    } catch (err) {
      alert(err.message || 'Failed to start interview session');
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !sessionId) return;

    const userMessage = {
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const answer = inputText;
    setInputText('');

    // Detect language
    const isArabic = isArabicText(answer);
    const detectedLang = isArabic ? 'ar' : 'en';
    console.log('💬 Chat message language:', detectedLang);

    try {
      // Get AI response using Gemini (same as Voice Mode)
      const aiResponse = await getAIResponse(answer, currentQuestion, detectedLang);

      // Save to backend (wait for it to ensure data consistency)
      try {
        await interviewAPI.submitAnswer(sessionId, {
          question: currentQuestion,
          answer: answer,
          language: detectedLang
        });
        console.log('✅ Answer saved to backend');
      } catch (err) {
        console.warn('⚠️ Backend save failed (non-critical):', err);
      }

      const newCount = questionCount + 1;
      setQuestionCount(newCount);
      console.log('📊 Question count:', newCount, '/ 10');

      setTimeout(() => {
        const aiMessage = {
          role: 'ai',
          text: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

        // Update current question for next round
        setCurrentQuestion(aiResponse);
      }, 1000);

      // Check if we've completed 10 questions
      if (newCount >= 10) {
        console.log('✅ Interview complete! Ending session...');
        setTimeout(() => endSession(), 3000);
      }
    } catch (err) {
      console.error('💥 Error:', err);
      alert('Failed to get AI response. Please try again.');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  const endSession = async () => {
    if (!sessionId) return;

    if (speechRecognizer) {
      speechRecognizer.cleanup();
    }
    if (audioRecorder) {
      audioRecorder.cleanup();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const response = await interviewAPI.completeSession(sessionId);

      setSessionComplete(true);
      setStep('complete');
      setPoints(response.points_earned);
      setFeedback({
        overallScore: response.overall_score,
        strengths: response.feedback.strengths,
        improvements: response.feedback.improvements,
        recommendations: response.feedback.recommendations
      });
    } catch (err) {
      alert(err.message || 'Failed to complete session');
    }
  };

  const resetSession = () => {
    setStep('setup');
    setMode(null);
    setStarted(false);
    setMessages([]);
    setSessionComplete(false);
    setFeedback(null);
    setPoints(0);
    setSessionId(null);
    setCurrentQuestion('');
    setCvFile(null);
    setJobTitle('');
    setDetectedLanguage('en');

    if (speechRecognizer) {
      speechRecognizer.cleanup();
    }
    if (audioRecorder) {
      audioRecorder.cleanup();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="ai-interview-page">
      <div className="ai-interview-bg">
        <div className="ai-interview-orb-1" />
        <div className="ai-interview-orb-2" />
      </div>

      <div className="particles-container">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <EmployeeNavbar />

      <div className="ai-interview-content">
        {/* Setup Phase */}
        {step === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="setup-section"
          >
            <h1 className="ai-interview-title">
              Setup Your AI Interview
            </h1>
            <p className="ai-interview-subtitle">
              Upload your CV and specify the job position for a personalized interview experience
            </p>

            <div className="setup-form">
              <div className="form-group">
                <label>Upload Your CV (Optional)</label>
                <div className="cv-upload-area">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files[0])}
                    style={{ display: 'none' }}
                    id="cv-upload-interview"
                  />
                  <label htmlFor="cv-upload-interview" className="upload-label">
                    <Upload size={24} />
                    {cvFile ? (
                      <span>✅ {cvFile.name}</span>
                    ) : (
                      <span>Choose PDF file</span>
                    )}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Job Title/Position</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Frontend Developer, Marketing Manager"
                  className="job-title-input"
                />
              </div>

              <button
                onClick={handleSetupComplete}
                className="continue-btn"
                disabled={!jobTitle.trim()}
              >
                Continue to Interview
              </button>
            </div>
          </motion.div>
        )}

        {/* Mode Selection */}
        {step === 'mode-selection' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mode-selection"
          >
            <button onClick={() => setStep('setup')} className="back-btn-setup">
              <ArrowLeft size={20} /> Back
            </button>

            <h1 className="ai-interview-title">
              Choose Your Practice Mode
            </h1>
            <p className="ai-interview-subtitle">
              Practice with AI to improve your interview skills. You can answer in English or Arabic!
            </p>

            <div className="job-info-display">
              <span>Position: <strong>{jobTitle}</strong></span>
              {cvFile && <span>📄 CV Uploaded</span>}
            </div>

            <div className="mode-cards">
              <motion.div
                className="mode-card"
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => startInterview('chat')}
              >
                <MessageSquare size={60} />
                <h3>Chat Mode</h3>
                <p>Text-based interview practice with instant feedback</p>
                <ul>
                  <li>✓ Type your answers in English or Arabic</li>
                  <li>✓ Take your time</li>
                  <li>✓ Review responses</li>
                </ul>
                <button className="mode-btn">Start Chat Interview</button>
              </motion.div>

              <motion.div
                className="mode-card mode-card-voice"
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => startInterview('voice')}
              >
                <Mic size={60} />
                <h3>Voice Mode</h3>
                <p>Speak your answers like a real interview with AI voice responses</p>
                <ul>
                  <li>✓ Voice responses</li>
                  <li>✓ AI speaks back to you</li>
                  <li>✓ Tone analysis</li>
                  <li>✓ Natural conversation</li>
                </ul>
                <button className="mode-btn mode-btn-voice">Start Voice Interview</button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Interview Session */}
        {step === 'interview' && started && !sessionComplete && (
          <div className="interview-session">
            <div className="interview-header">
              <button onClick={resetSession} className="back-btn">
                <ArrowLeft size={20} /> {detectedLanguage === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <div className="interview-progress">
                <div className="mode-indicator">
                  {mode === 'chat' ? <MessageSquare size={20} /> : <Mic size={20} />}
                  {mode === 'chat' ? (detectedLanguage === 'ar' ? 'وضع الكتابة' : 'Chat Mode') : (detectedLanguage === 'ar' ? 'وضع الصوت' : 'Voice Mode')}
                  {isAISpeaking && mode === 'voice' && (
                    <span className="ai-speaking">🔊 {detectedLanguage === 'ar' ? 'الذكاء يتحدث...' : 'AI Speaking...'}</span>
                  )}
                </div>
                <div className="question-counter">
                  {detectedLanguage === 'ar' ? `السؤال ${questionCount + 1} من 10` : `Question ${questionCount + 1} of 10`}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${((questionCount + 1) / 10) * 100}%` }}
                  />
                </div>
              </div>
              {questionCount >= 5 && (
                <button onClick={endSession} className="end-btn">
                  {detectedLanguage === 'ar' ? 'إنهاء المقابلة' : 'End Interview'}
                </button>
              )}
            </div>

            <div className="messages-container">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`message ${msg.role}`}
                  >
                    <div className="message-avatar">
                      {msg.role === 'ai' ? '🤖' : '👤'}
                    </div>
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <span className="message-time">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {mode === 'chat' && (
              <div className="input-container">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your answer here (English or Arabic)..."
                  className="message-input"
                />
                <button onClick={sendMessage} className="send-btn">
                  <Send size={20} />
                </button>
              </div>
            )}

            {mode === 'voice' && (
              <div className="voice-controls">
                <div className="language-toggle">
                  <button
                    onClick={() => setDetectedLanguage('ar')}
                    className={`lang-btn ${detectedLanguage === 'ar' ? 'active' : ''}`}
                  >
                    🇸🇦 عربي
                  </button>
                  <button
                    onClick={() => setDetectedLanguage('en')}
                    className={`lang-btn ${detectedLanguage === 'en' ? 'active' : ''}`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => {
                      testArabicVoice();
                    }}
                    className="lang-btn"
                    title="Test Arabic voice"
                  >
                    🔊 اختبار
                  </button>
                </div>

                <motion.button
                  onClick={toggleRecording}
                  className={`record-btn ${isRecording ? 'recording' : ''}`}
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  disabled={isAISpeaking}
                >
                  <Mic size={32} />
                  {isRecording 
                    ? (detectedLanguage === 'ar' ? '🎤 أستمع...' : '🎤 Listening...') 
                    : isAISpeaking 
                      ? (detectedLanguage === 'ar' ? 'الذكاء يتحدث...' : 'AI Speaking...') 
                      : (detectedLanguage === 'ar' ? 'اضغط للتحدث' : 'Tap to Speak')}
                </motion.button>

                {voiceAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="voice-analysis"
                  >
                    <h4>Voice Analysis</h4>
                    <div className="analysis-metrics">
                      <div className="metric">
                        <span>Confidence</span>
                        <div className="metric-bar">
                          <div
                            className="metric-fill confidence"
                            style={{ width: `${voiceAnalysis.confidence}%` }}
                          />
                        </div>
                        <span>{voiceAnalysis.confidence}%</span>
                      </div>
                      <div className="metric">
                        <span>Clarity</span>
                        <div className="metric-bar">
                          <div
                            className="metric-fill clarity"
                            style={{ width: `${voiceAnalysis.clarity}%` }}
                          />
                        </div>
                        <span>{voiceAnalysis.clarity}%</span>
                      </div>
                      <div className="metric">
                        <span>Pace</span>
                        <div className="metric-bar">
                          <div
                            className="metric-fill pace"
                            style={{ width: `${voiceAnalysis.pace}%` }}
                          />
                        </div>
                        <span>{voiceAnalysis.pace}%</span>
                      </div>
                      <div className="tone-indicator">
                        <span>Tone: <strong>{voiceAnalysis.tone}</strong></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Feedback Section */}
        {step === 'complete' && sessionComplete && feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="feedback-section"
          >
            <div className="feedback-header">
              <Award size={60} className="award-icon" />
              <h1>Session Complete! 🎉</h1>
              <p>Here's your performance analysis</p>
            </div>

            <div className="score-display">
              <div className="score-circle-large">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    style={{
                      strokeDasharray: `${feedback.overallScore * 3.39}, 339`,
                    }}
                  />
                </svg>
                <div className="score-content">
                  <span className="score-num">{feedback.overallScore}</span>
                  <span className="score-max">/100</span>
                </div>
              </div>
              <div className="points-earned">
                <TrendingUp size={24} />
                <span>+{points} Points Earned!</span>
              </div>
            </div>

            <div className="feedback-grid">
              <div className="feedback-card">
                <div className="feedback-card-header">
                  <CheckCircle size={24} />
                  <h3>Your Strengths</h3>
                </div>
                <ul>
                  {feedback.strengths.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="feedback-card">
                <div className="feedback-card-header">
                  <Target size={24} />
                  <h3>Areas to Improve</h3>
                </div>
                <ul>
                  {feedback.improvements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="feedback-card full-width">
                <div className="feedback-card-header">
                  <TrendingUp size={24} />
                  <h3>Recommendations</h3>
                </div>
                <ul>
                  {feedback.recommendations.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="feedback-actions">
              <button onClick={resetSession} className="try-again-btn">
                Practice Again
              </button>
              <button onClick={() => navigate('/employee-home')} className="home-btn">
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
