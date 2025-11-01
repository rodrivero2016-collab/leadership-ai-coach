{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import OpenAI from 'openai';\
\
// 1. Initialize OpenAI securely: The API key is read from Vercel's Environment Variables (OPENAI_API_KEY),\
// ensuring it is never exposed in the client-side code.\
const openai = new OpenAI(\{\
  apiKey: process.env.OPENAI_API_KEY, \
\});\
\
// 2. System Prompt: This defines the AI's persona, its knowledge base, and its constraints.\
const systemPrompt = `You are a domain-specific leadership coach named "Cum Corde Leadership AI." Your responses must be grounded EXCLUSIVELY in the following four sources and the user's A.C.T. Framework: \
1. FM 6-22: Army Leadership \
2. Simon Sinek's "Start With Why" \
3. "The Starfish and the Spider" \
4. "The Little Black Book of Leadership"\
5. A.C.T. Framework (Accountability, Continuity, Transparency).\
Focus on providing empathetic, practical, and principle-based leadership guidance. Do not use general knowledge or web searches.`;\
\
// 3. Main Handler Function\
export default async function handler(req, res) \{\
  \
  // Only allow POST requests from your frontend\
  if (req.method !== 'POST') \{\
    return res.status(405).json(\{ message: 'Method Not Allowed' \});\
  \}\
\
  const \{ prompt \} = req.body;\
\
  if (!prompt) \{\
    return res.status(400).json(\{ message: 'Prompt is required.' \});\
  \}\
  \
  try \{\
    // Send request to the OpenAI API\
    const response = await openai.chat.completions.create(\{\
      model: "gpt-3.5-turbo", // Recommended model for cost-effectiveness and speed\
      messages: [\
        \{ role: "system", content: systemPrompt \}, // Define the AI's role\
        \{ role: "user", content: prompt \} // User's message\
      ],\
      max_tokens: 300, // Limit response length\
      temperature: 0.7, // Set creativity level\
    \});\
\
    const aiResponse = response.choices[0].message.content.trim();\
    \
    // Send the final AI response back to your frontend's script.js file\
    res.status(200).json(\{ response: aiResponse \});\
\
  \} catch (error) \{\
    console.error('OpenAI API Error:', error);\
    // Send a generic error message if the API call fails\
    res.status(500).json(\{ \
      message: 'Failed to generate response. Check API key and quota in Vercel settings.'\
    \});\
  \}\
\}}