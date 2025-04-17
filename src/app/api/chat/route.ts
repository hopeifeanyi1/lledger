// src/app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, decisionContext } = await req.json();

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

    // Initialize base system prompt for LifeLedger's AI Thought Partner
    let systemPrompt = `
      You are the LifeLedger AI Thought Partner, a supportive guide to help users think through decisions.
      
      Your main capabilities:
      1. Help users explore options, tradeoffs, and risks associated with their decisions
      2. Identify potential cognitive biases in their thinking process
      3. Ask thoughtful questions to deepen their reflection
      4. Organize pros and cons of different options
      5. Provide a structured framework for decision-making without telling them what to decide
      
      Be conversational, thoughtful, and empathetic. Ask clarifying questions when needed.
      Never make the decision for the user - your role is to guide their thinking process.
      
      When you notice potential cognitive biases, gently point them out with a yellow warning symbol: ⚠️
      Common biases to watch for:
      - Confirmation bias: Favoring information that confirms existing beliefs
      - Recency bias: Overweighting recent events or information
      - Loss aversion: Preferring to avoid losses over acquiring gains
      - Sunk cost fallacy: Continuing a behavior due to previously invested resources
      - Overconfidence: Excessive certainty in one's abilities or opinions
    `
    

    // Add decision-specific context if provided
    if (decisionContext) {
      systemPrompt += `\n\n--- CURRENT DECISION CONTEXT ---
      Decision Type: ${decisionContext.category || 'Unspecified'}
      Urgency: ${decisionContext.urgency || 'Unspecified'}
      Description: ${decisionContext.description || 'No description provided'}
      
      Start by acknowledging this decision context and asking clarifying questions to better understand the situation.
      `;
    }

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

// Helper functions to summarize decision history
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function summarizeCategories(decisions: any[]) {
  // Count categories and return top 3
  const categoryCounts: Record<string, number> = {};
  
  decisions.forEach(decision => {
    if (decision.category) {
      categoryCounts[decision.category] = (categoryCounts[decision.category] || 0) + 1;
    }
  });
  
  return Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category)
    .join(', ');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function summarizeOutcomes(decisions: any[]) {
  // Count outcome ratings
  let positive = 0;
  let neutral = 0;
  let negative = 0;
  
  decisions.forEach(decision => {
    if (decision.reflection?.outcome === 'Happy') positive++;
    else if (decision.reflection?.outcome === 'Neutral') neutral++;
    else if (decision.reflection?.outcome === 'Regret') negative++;
  });
  
  const total = positive + neutral + negative;
  
  if (total === 0) return 'No outcomes recorded yet';
  
  return `${Math.round((positive/total)*100)}% positive, ${Math.round((neutral/total)*100)}% neutral, ${Math.round((negative/total)*100)}% negative`;
}