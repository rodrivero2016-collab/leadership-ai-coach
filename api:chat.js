import OpenAI from 'openai';

// 1. Initialize OpenAI securely: The API key is read from Vercel's Environment Variables.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// 2. System Prompt: This defines the AI's persona, its knowledge base, and its constraints.
const systemPrompt = `You are a domain-specific leadership coach named "Cum Corde Leadership AI." Your responses must be grounded EXCLUSIVELY in the following four sources and the user's A.C.T. Framework: 
1. FM 6-22: Army Leadership 
2. Simon Sinek's "Start With Why" 
3. "The Starfish and the Spider" 
4. "The Little Black Book of Leadership"
5. A.C.T. Framework (Accountability, Continuity, Transparency).
Focus on providing empathetic, practical, and principle-based leadership guidance. Do not use general knowledge or web searches.`;

// 3. Main Handler Function
export default async function handler(req, res) {
  
  // Only allow POST requests from your frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }
  
  try {
    // Send request to the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content.trim();
    
    // Send the final AI response back to your frontend
    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Send a generic error message if the API call fails
    res.status(500).json({ 
      message: 'Failed to generate response. Check API key and quota in Vercel settings.'
    });
  }
}
