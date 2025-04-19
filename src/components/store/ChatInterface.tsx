'use client';
import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "./Icon";
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LoaderCircle, Briefcase, BookOpen, Award, Pencil, X, Check, Mic, Volume2, AudioLines, StopCircle } from "lucide-react";
import { useVoiceService } from "./VoiceService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ChatInterface = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [minTimeElapsed, setMinTimeElapsed] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const editTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    error,
    setMessages,
    reload
  } = useChat({
    api: '/api/chat',
    onError: (err) => {
      console.error('Chat Error:', err);
      toast.error(err.message || 'An error occurred during the chat');
    }
  });

  // Display toast error when error state changes
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred');
    }
  }, [error]);

  const voiceService = useVoiceService({
    messages,
    setMessages,
    input,
    handleInputChange
  });

  useEffect(() => {
    if (isLoading) {
      setMinTimeElapsed(false);
      timeoutRef.current = setTimeout(() => {
        setMinTimeElapsed(true);
      }, 3000);
    } else {
      setMinTimeElapsed(true);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading]);

  const showTyping = isLoading || !minTimeElapsed;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  useEffect(() => {
    if (!input && textAreaRef.current) {
      textAreaRef.current.style.height = '52px';
      setIsExpanded(false);
    }
  }, [input]);

  // Auto-resize edit textarea
  useEffect(() => {
    if (editingMessageId && editTextAreaRef.current) {
      editTextAreaRef.current.style.height = "auto";
      editTextAreaRef.current.style.height = `${editTextAreaRef.current.scrollHeight}px`;
    }
  }, [editingContent, editingMessageId]);

  // Focus the edit textarea when editing starts
  useEffect(() => {
    if (editingMessageId && editTextAreaRef.current) {
      editTextAreaRef.current.focus();
    }
  }, [editingMessageId]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${newHeight}px`;
    setIsExpanded(newHeight > 52);
    textarea.style.overflowY = newHeight === 180 ? "auto" : "hidden";
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '52px';
    }
  };

  const handleEditStart = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleEditSubmit = () => {
    if (!editingMessageId || !editingContent.trim()) {
      handleEditCancel();
      return;
    }

    // Find the edited message index
    const editedMessageIndex = messages.findIndex(m => m.id === editingMessageId);
    if (editedMessageIndex === -1) {
      handleEditCancel();
      return;
    }

    const newMessages = [...messages];
    
    newMessages[editedMessageIndex] = {
      ...newMessages[editedMessageIndex],
      content: editingContent
    };
    
    const truncatedMessages = newMessages.slice(0, editedMessageIndex + 2);
    
    const lastMessageIndex = messages.length - 1;
    const finalMessages = editedMessageIndex === lastMessageIndex ? newMessages : truncatedMessages;
    
    setMessages(finalMessages);
    
    setEditingMessageId(null);
    setEditingContent("");
    
    if (editedMessageIndex < lastMessageIndex) {
      setTimeout(() => {
        // Convert the messages to a format that matches JSONValue
        const jsonSafeMessages = finalMessages.map(msg => ({
          id: msg.id,
          role: msg.role as "user" | "system" | "assistant",
          content: msg.content
        }));
        
        reload({
          data: { messages: jsonSafeMessages }
        }).catch(err => {
          toast.error('Failed to reload messages');
          console.error(err);
        });
      }, 100);
    }
  };

  useEffect(() => {
      const checkUser = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            router.push('/login');
            return;
          }
    
          setUser(data.session.user);
          setLoading(false);
        } catch (err) {
          toast.error('Authentication error');
          console.error('Auth error:', err);
          router.push('/login');
        }
      };
  
      checkUser();
  
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        } else if (session && event === 'SIGNED_IN') {
          setUser(session.user);
          setLoading(false);
        }
      });
  
      return () => {
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    }, [router]);
  
    if (loading) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-screen"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <LoaderCircle className="h-8 w-8 text-[#D1376A]" />
          </motion.div>
        </motion.div>
      );
    }
  
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  // Suggested career-related questions
  const suggestedQuestions = [
    "Help me decide between two job offers",
    "What questions should I consider for a big purchase?",
    "How can I identify my biases in this decision?",
    "What factors should I weigh for a career change?"
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const messageVariants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex flex-col bg-transparent"
    >
      <div className="relative lg:rounded-2xl flex-1 text-foreground w-full lg:w-[85%] mx-0 lg:mx-auto flex flex-col lg:h-[calc(100dvh-120px)] overflow-scroll bg-transparent">        
        <div className="flex-1 space-y-4 lg:px-4 px-3 overflow-x-hidden lg:pt-3 pt-[55px]">
          {messages.length === 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col h-full items-center justify-center gap-6"
            >
              <motion.div variants={itemVariants} className="text-center">
                <motion.h3 
                  variants={itemVariants}
                  className="md:text-xl text-lg font-medium mb-2"
                >
                  Hey {userName?.split(" ")[0]}, ready to think through something today?
                </motion.h3>
                <motion.p variants={itemVariants} className="md:text-[16px] text-md">
                  I&apos;m your thought partner to help you make better decisions and learn from past ones.
                </motion.p>
              </motion.div>
              
              <motion.div 
                variants={containerVariants}
                className="grid md:grid-cols-2 grid-cols-1 gap-3 w-full max-w-2xl px-4"
              >
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-secondary hover:bg-foreground/20 text-left px-4 py-3 rounded-lg text-sm flex items-start transition-colors"
                    onClick={() => {
                      if (textAreaRef.current) {
                        textAreaRef.current.value = question;
                        const event = new Event('input', { bubbles: true });
                        textAreaRef.current.dispatchEvent(event);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        handleInputChange({ target: { value: question } } as any);
                      }
                    }}
                  >
                    <div className="mr-3 mt-0.5">
                      {index === 0 && <Briefcase className="h-4 w-4 text-blue-500" />}
                      {index === 1 && <Award className="h-4 w-4 text-green-500" />}
                      {index === 2 && <BookOpen className="h-4 w-4 text-purple-500" />}
                      {index === 3 && <Award className="h-4 w-4 text-orange-500" />}
                    </div>
                    <span>{question}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div 
                  key={m.id} 
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className={`flex text-sm mb-10 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div 
                    layout
                    className={`lg:max-w-[80%] max-w-[87%] ${
                      m.role === 'user' 
                        ? 'bg-[#E0E0E0] dark:bg-neutral-600 relative' 
                        : 'relative bg-[#D1376A]/25'
                    } ${
                        m.role === 'user' 
                          ? (m.content.length > 22 ? 'rounded-t-[25px] rounded-bl-[25px]' : 'rounded-t-full rounded-bl-full')
                          : (m.content.length > 22 ? 'rounded-t-[25px] rounded-br-[25px]' : 'rounded-t-full rounded-br-full')
                      } px-4 lg:px-5 lg:py-3.5 py-2`}
                  >
                    {m.role === 'user' && editingMessageId !== m.id && (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        onClick={() => handleEditStart(m.id, m.content)}
                        className="absolute right-[2px] bottom-[-30px] transform -translate-y-1/2"
                        aria-label="Edit message"
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </motion.button>
                    )}
                    
                    {m.role === 'assistant' && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute -left-8 top-1/2 transform -translate-y-1/2"
                        aria-label="Play response"
                      >
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      </motion.button>
                    )}
                    
                    {editingMessageId === m.id ? (
                      <div className="flex flex-col whitespace-pre-wrap space-y-2 w-full">
                        <textarea
                          ref={editTextAreaRef}
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full bg-transparent resize-none outline-none"
                          rows={1}
                        />
                        <div className="flex justify-end space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditCancel}
                            className="p-1 rounded-full hover:bg-secondary"
                            aria-label="Cancel edit"
                          >
                            <X className="h-4 w-4" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditSubmit}
                            className="p-1 rounded-full hover:bg-secondary"
                            aria-label="Submit edit"
                          >
                            <Check className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-md whitespace-pre-wrap">
                        {m.content}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {showTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm flex pl-4"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                className="bg-secondary-foreground rounded-full w-[10px] h-[10px] mr-[8px]"
              />
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                className="bg-secondary-foreground rounded-full w-[10px] h-[10px] mr-[8px]"
              />
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                className="bg-secondary-foreground rounded-full w-[10px] h-[10px]"
              />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <motion.form 
          variants={formVariants}
          initial="hidden"
          animate="show"
          onSubmit={handleFormSubmit} 
          className={`flex items-end border border-secondary-foreground/30 bg-white text-black lg:w-[70%] w-[100%] px-4 py-1.5 min-h-[52px] transition-all duration-300 mx-auto my-1.5 ${isExpanded ? "rounded-2xl" : "rounded-full"}`}
        >
          <textarea
            ref={textAreaRef}
            value={input}
            onChange={handleInput}
            placeholder="Type your thoughts..."
            className="pl-2 lg:mr-5 mr-2 outline-none w-full resize-none bg-transparent max-h-[180px] overflow-y-hidden py-3 lg:text-md text-sm"
            rows={1}
            disabled={isLoading || voiceService.isRecording || voiceService.isProcessingVoice}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={voiceService.isRecording ? voiceService.stopRecording : voiceService.startRecording}
            className={`rounded-full w-10 h-10 flex items-center justify-center shrink-0 mr-2 bg-[#D1376A] ${isExpanded ? "" : "my-auto"} ${
              (isLoading || voiceService.isProcessingVoice) ? 'opacity-50 cursor-not-allowed' : ''
            } transition-colors`}
            disabled={isLoading || voiceService.isProcessingVoice}
          >
            {voiceService.isRecording ? (
              <StopCircle className="w-5 h-5 text-white" />
            ) : voiceService.isProcessingVoice ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LoaderCircle className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className={`bg-black rounded-full w-10 h-10 flex items-center justify-center shrink-0 ${isExpanded ? "" : "my-auto"} transition-colors`}
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-white text-xl"
              >
                <LoaderCircle className="w-4 h-4"/>
              </motion.div>
            ) : input.trim() === '' ? (
              <AudioLines className="w-5 h-5 text-white" />
            ) : (
              <SendIcon className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default ChatInterface;