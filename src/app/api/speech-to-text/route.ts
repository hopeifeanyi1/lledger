// src/app/api/speech-to-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Check file size (limit to 2MB to be safe)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 2MB.' },
        { status: 400 }
      );
    }

    // Validate the audio file
    if (audioFile.size === 0) {
      return NextResponse.json(
        { error: 'Audio file is empty' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Debug log file details
    console.log(`Processing audio file: size=${buffer.length} bytes, type=${audioFile.type}`);
    
    // Create a form data object for the API request
    const apiFormData = new FormData();
    
    // Use a fixed filename with extension matching the content type
    let filename = 'audio.webm';
    let contentType = 'audio/webm';
    
    // Map file types to appropriate extensions
    if (audioFile.type.includes('ogg')) {
      filename = 'audio.ogg';
      contentType = 'audio/ogg';
    } else if (audioFile.type.includes('wav') || audioFile.type.includes('wave')) {
      filename = 'audio.wav';
      contentType = 'audio/wav';
    } else if (audioFile.type.includes('mp3') || audioFile.type.includes('mpeg')) {
      filename = 'audio.mp3';
      contentType = 'audio/mpeg';
    }
    
    apiFormData.append('file', buffer, {
      filename: filename,
      contentType: contentType,
    });
    
    apiFormData.append('model', 'whisper-large-v3-turbo');
    apiFormData.append('response_format', 'json');
    apiFormData.append('language', 'en');

    console.log(`Sending request to Groq with filename: ${filename}, contentType: ${contentType}`);

    // Make direct API call to Groq's speech-to-text endpoint
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        ...apiFormData.getHeaders()
      },
      body: apiFormData
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Groq:', errorText);
      
      return NextResponse.json(
        { 
          error: `Speech-to-text API error: ${errorText}`,
          text: "I'm having trouble processing your audio. Please try again with clearer audio."
        }, 
        { status: 500 }
      );
    }

    // Get the response data
    const responseData = await response.json();
    
    // Return the transcription result
    if (responseData && responseData.text) {
      return NextResponse.json({ 
        text: responseData.text, 
        x_groq: responseData 
      });
    } else {
      // Return a fallback response when transcription didn't have text
      return NextResponse.json({
        text: "I couldn't transcribe that clearly. Please try speaking again.",
        error: 'No transcription text found'
      });
    }
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json(
      { 
        text: "Sorry, there was a problem with voice recognition. Please try again.",
        error: 'Speech-to-text failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}