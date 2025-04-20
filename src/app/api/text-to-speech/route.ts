// src/app/api/text-to-speech/route.ts
import { NextRequest } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'Fritz-PlayAI' } = await request.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use direct API call to Groq's TTS endpoint
    const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'playai-tts',
        voice: voice,
        input: text,
        response_format: 'wav'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Text-to-speech API error: ${JSON.stringify(errorData)}`);
    }

    // Get binary audio data
    const audioBuffer = await response.arrayBuffer();
    
    // Return audio file
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return new Response(
      JSON.stringify({ error: 'Text-to-speech failed', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}