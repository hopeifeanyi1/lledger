// src/app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ 
        error: "Invalid request format: messages must be an array"
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Initialize base system prompt
    const systemPrompt = `
      You are the Career Navigator AI, a professional career advisor and skill development coach.

      Your main capabilities:
      1. Help users discover career paths based on their skills, interests, and education
      2. Analyze skill gaps for specific careers and suggest learning resources
      3. Provide advice on resume building and interview preparation
      4. Recommend educational paths and courses
      5. Track user progress on their career journey

      Be conversational but professional. Ask clarifying questions when needed.
      When suggesting courses or resources, provide specific recommendations with brief descriptions.
    `;

    // Generate AI response with the personalized system prompt
    const result = await streamText({
      model: groq('llama3-70b-8192'), 
      system: systemPrompt,
      messages,
    });

    // Return the stream response
    return new Response(result.toDataStream(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message || 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}