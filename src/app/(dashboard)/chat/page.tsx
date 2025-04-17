// src/app/(dashboard)/chat/page.tsx
'use client'

import React from 'react'
import ChatInterface from '@/components/store/ChatInterface'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const AIThoughtPartnerPage = () => {
  return (
    <div className="container flex flex-col p-4 md:p-6 h-full">
      <h1 className="text-2xl font-serif mb-2">AI Thought Partner</h1>
      <p className="text-muted-foreground mb-6">Guide your decision-making process with AI assistance</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-80px)]">
        <div className="lg:col-span-3 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-serif">Think Through Your Decision</CardTitle>
              <CardDescription>
                I&apos;ll help you explore options, consider tradeoffs, and identify potential biases
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden pb-0">
              <ChatInterface />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-serif">Thinking Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full rounded-md p-3 text-sm bg-secondary/50 hover:bg-secondary transition-colors">
                  <span>Pros & Cons Analysis</span>
                  <span>+</span>
                </button>
                <button className="flex items-center justify-between w-full rounded-md p-3 text-sm bg-secondary/50 hover:bg-secondary transition-colors">
                  <span>Decision Matrix</span>
                  <span>+</span>
                </button>
                <button className="flex items-center justify-between w-full rounded-md p-3 text-sm bg-secondary/50 hover:bg-secondary transition-colors">
                  <span>Bias Checker</span>
                  <span>+</span>
                </button>
                <button className="flex items-center justify-between w-full rounded-md p-3 text-sm bg-secondary/50 hover:bg-secondary transition-colors">
                  <span>Reflection Prompts</span>
                  <span>+</span>
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-serif">Bias Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-800 dark:text-yellow-300 mb-3">
                  <div className="text-lg">⚠️</div>
                  <div>
                    <p className="font-medium">Confirmation Bias</p>
                    <p className="text-xs mt-1">You might be seeking information that confirms your existing beliefs</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Alerts appear when potential biases are detected in your decision process
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AIThoughtPartnerPage