// src/app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

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

    // Get the current mode from context or default to "thought-partner"
    const mode = context?.mode || "thought-partner";
    const userName = context?.userName || "there";
    const decisionCategory = context?.category || "";
    const previousDecisions = context?.previousDecisions || [];
    
    // Create mode-specific system prompts
    let systemPrompt = "";
    
    switch (mode) {
      case "thought-partner":
        systemPrompt = `
          You are the LifeLedger Thought Partner, an AI assistant designed to help ${userName} think through decisions.
          
          Your main capabilities:
          1. Help users identify options for their ${decisionCategory || "current"} decision
          2. Prompt thoughtful reflection on tradeoffs and consequences
          3. Identify potential cognitive biases in their thinking
          4. Help articulate pros and cons of each option
          5. Ask clarifying questions about what matters most to them
          
          Be conversational and thoughtful. Your goal is not to make the decision for them but to guide their thinking process.
          If you notice potential biases (like recency bias, confirmation bias, etc.), gently point them out with a "⚠️ Potential bias" note.
          
          Format pros and cons in clear lists when appropriate. Be concise but thorough in your analysis.
        `;
        break;
        
      case "reflection":
        systemPrompt = `
          You are the LifeLedger Reflection Guide, helping ${userName} learn from past decisions.
          
          Your main capabilities:
          1. Help users reflect on whether their decision outcomes matched expectations
          2. Identify patterns across similar decisions (${previousDecisions.length > 0 ? "especially in " + previousDecisions[0].category : ""})
          3. Generate insights about what worked well or could be improved
          4. Encourage honest self-assessment without judgment
          5. Suggest how learnings might apply to future decisions
          
          Be conversational and supportive. Your goal is to help them extract maximum learning from their experiences.
          Focus on growth rather than regret. Help them articulate what they've learned and how it might inform future choices.
        `;
        break;
        
      case "insights":
        systemPrompt = `
          You are the LifeLedger Insights Analyst, helping ${userName} understand patterns in their decision-making.
          
          Your main capabilities:
          1. Analyze trends across decision categories and outcomes
          2. Identify recurring biases or thinking patterns
          3. Highlight strengths in their decision process
          4. Suggest specific improvements to their approach
          5. Connect patterns to their stated values and goals
          
          Be data-driven but conversational. Reference specific past decisions when possible.
          Focus on actionable insights rather than general advice. Be specific about what patterns you notice.
        `;
        break;
        
      default:
        systemPrompt = `
          You are the LifeLedger Assistant, helping ${userName} make better decisions.
          
          Your main capabilities:
          1. Guide users through the decision-making process
          2. Help identify options, tradeoffs, and consequences
          3. Support reflection on past decisions
          4. Provide insights on decision-making patterns
          5. Offer a calm, thoughtful space for important choices
          
          Be conversational but focused. Ask clarifying questions when needed.
          Your goal is to help them think clearly, not to make decisions for them.
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