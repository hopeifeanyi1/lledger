// src/app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { cookies } from 'next/headers';


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
    let systemPrompt = `
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

    // Get user context if authenticated
    let userContext = null;
    let userResumeData = null;

    try {
      // Verify user session and get user ID
      const sessionCookie = (await cookies()).get('session')?.value;

      if (sessionCookie) {
        console.log('Session cookie found, attempting to verify...');
        try {
          // CHANGE THIS LINE - Replace InitializeFirebaseAdmin with verifySession
          const decodedToken = await verifySession(sessionCookie, true);
          console.log('Session verified successfully. User data:', decodedToken);

          if (decodedToken?.uid) {
            // Get user profile data for AI context
            userContext = await getUserProfileForAI(decodedToken.uid);

            // Get user resume data
            try {
              console.log('Getting resume data for user:', decodedToken.uid);
              userResumeData = await getResumeData(decodedToken.uid);
              
              if (userResumeData) {
                console.log('Resume data successfully retrieved');
              } else {
                console.log('No resume data found for this user');
              }
            } catch (resumeError) {
              console.error('Error getting resume data:', resumeError);
              // Continue execution without resume data
              userResumeData = null;
            }

            if (userContext && userContext.isProfileComplete) {
              // Add user-specific context to system prompt
              systemPrompt += `\n\n--- USER PROFILE INFORMATION ---\n${userContext.context}\n`;

              if (userResumeData && (userResumeData.organizedText || userResumeData.atsFriendlyText)) {
                const resumeText = userResumeData.atsFriendlyText || userResumeData.organizedText;

                if (resumeText && resumeText.trim() !== '') {
                  console.log('Adding resume text to prompt. Length:', resumeText.length);
                  systemPrompt += `\n\n--- USER RESUME INFORMATION ---\n${resumeText}\n`;

                  systemPrompt += `\n--- RESUME UTILIZATION INSTRUCTIONS ---
                  1. Use the resume information to understand the user's experience, skills, and qualifications.
                  2. Reference specific parts of their resume when providing career advice or suggestions.
                  3. Identify potential skill gaps or areas for improvement based on their resume.
                  4. Use their work history to suggest relevant career paths or transitions.
                  5. When discussing resume improvements, refer to specifics from their current resume.
                  6. IMPORTANT: When asked "what do you know about me", clearly mention you know about their resume and reference specific details like their job titles, skills, or education from the resume.
                  `;
                } else {
                  console.log('Resume text exists but is empty');
                }
              }

              // Add personalization instructions
              systemPrompt += `\n--- PERSONALIZATION INSTRUCTIONS ---
              1. Use the user's first name occasionally to personalize the conversation.
              2. Tailor your recommendations based on their specific skills and education background.
              3. Consider their education level when suggesting learning resources.
              4. Use their skills as a foundation when discussing career paths.
              5. If they ask about skills or education you don't see in their profile, ask them about it.
              `;
            } else {
              // Profile incomplete
              systemPrompt += `\n\nThe user is registered but their profile data is incomplete. Encourage them to complete their skills and education profile for more personalized career guidance.`;

              // Check if they at least have resume data
              if (userResumeData && (userResumeData.organizedText || userResumeData.atsFriendlyText)) {
                systemPrompt += `\n\n--- USER RESUME INFORMATION ---\n`;
                const resumeText = userResumeData.atsFriendlyText || userResumeData.organizedText;
                systemPrompt += `${resumeText}\n`;

                systemPrompt += `\nWhile the user hasn't completed their profile, you can use their resume information to provide more tailored guidance.`;
              }
            }
          }
        } catch (sessionError) {
          console.error('Session verification failed - DETAILS:', sessionError);
          // Continue without user context
        }
      } else {
        console.log('No session cookie found');
      }
    } catch (error) {
      console.error('Session/profile error:', error);
      // Continue without user context if there's an error
    }

    // Rest of the function remains the same...
    // [existing code continues]

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