// src/components/store/ChatInterface.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Loader2, ThumbsUp, ThumbsDown } from "lucide-react"

const ChatInterface = () => {
  const [isSending, setIsSending] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sample decision context - in a real app, this would come from the decision entry form
  const decisionContext = {
    category: "Career",
    urgency: "Soon",
    description: "Deciding whether to take a new job offer or stay at my current company"
  }

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      decisionContext: decisionContext
    },
    onResponse: () => {
      setIsSending(false)
    }
  })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      setIsSending(true)
      setShowSuggestions(false)
      handleSubmit(e)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (textareaRef.current) {
      textareaRef.current.value = suggestion
      handleInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLTextAreaElement>)
      setShowSuggestions(false)
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const renderMessage = (message: any, index: number) => {
    const isUser = message.role === 'user'
    
    return (
      <div 
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <Avatar className={`h-8 w-8 ${isUser ? 'ml-2' : 'mr-2'}`}>
            <AvatarFallback>{isUser ? 'U' : 'AI'}</AvatarFallback>
            {!isUser && <AvatarImage src="/ai-avatar.png" alt="AI" />}
          </Avatar>
          
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground rounded-tr-none' 
              : 'bg-secondary text-secondary-foreground rounded-tl-none'
          }`}>
            <div className="text-sm whitespace-pre-wrap">
              {message.content}
            </div>
            
            {!isUser && (
              <div className="flex items-center justify-end gap-2 mt-2">
                <button className="text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button className="text-muted-foreground hover:text-foreground">
                  <ThumbsDown className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow pr-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-muted-foreground mb-2">I'm your AI Thought Partner</p>
              <p className="text-sm text-muted-foreground">How can I help with your decision today?</p>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {showSuggestions && messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <Button 
            variant="outline" 
            className="justify-start h-auto py-3 px-4 text-left"
            onClick={() => handleSuggestionClick("What are the options I should consider for this decision?")}
          >
            <div>
              <p className="font-medium">What are my options?</p>
              <p className="text-xs text-muted-foreground">Explore possible choices</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="justify-start h-auto py-3 px-4 text-left"
            onClick={() => handleSuggestionClick("What are the pros and cons of each option I'm considering?")}
          >
            <div>
              <p className="font-medium">Pros & Cons</p>
              <p className="text-xs text-muted-foreground">List benefits and drawbacks</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="justify-start h-auto py-3 px-4 text-left"
            onClick={() => handleSuggestionClick("What biases might be affecting my thinking about this decision?")}
          >
            <div>
              <p className="font-medium">Check for Biases</p>
              <p className="text-xs text-muted-foreground">Identify cognitive blind spots</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="justify-start h-auto py-3 px-4 text-left"
            onClick={() => handleSuggestionClick("What values or criteria matter most to me in this decision?")}
          >
            <div>
              <p className="font-medium">Clarify Values</p>
              <p className="text-xs text-muted-foreground">What matters most to you</p>
            </div>
          </Button>
        </div>
      )}
      
      <form onSubmit={handleFormSubmit} className="flex items-end gap-2 pt-2">
        <div className="flex-grow relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="min-h-12 resize-none pr-12"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (input.trim()) {
                  setIsSending(true)
                  handleSubmit(e as any)
                }
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 bottom-2 h-8 w-8" 
            disabled={isSending || !input.trim()}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatInterface