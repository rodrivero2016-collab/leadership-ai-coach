{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Functionality placeholder: You need to insert your actual logic here.\
\
// Sample leadership responses (from your initial screenshot)\
const sampleResponses = \{\
  showNext: true, \
\
  // Sample response 1: Simon Sinek's 'Start With Why'\
  response1: `Based on Simon Sinek's 'Start With Why' principles, effective leaders inspire action by communicating their purpose first. Focus on why your team's work matters, not just what they need to do. This creates intrinsic motivation that drives performance.`,\
  \
  // Sample response 2: Military Doctrine\
  response2: `Military leadership teaches us that taking care of your people is paramount. Check in with struggling team members privately, understand their challenges, and provide specific, personalized support. Clear communication and unwavering presence build the loyalty required for high performance in challenging environments.`\
\};\
\
// --- DOM Element Selection ---\
const apiKeyInput = document.getElementById('apiKey');\
const unlockBtn = document.getElementById('unlock-btn');\
const userInput = document.getElementById('userInput');\
const sendBtn = document.getElementById('send-btn');\
const chatEchat = document.getElementById('echat');\
\
// --- EVENT LISTENERS (Placeholders for your logic) ---\
\
unlockBtn.addEventListener('click', () => \{\
    // 1. You need to insert your logic here to validate the OpenAI API Key.\
    const key = apiKeyInput.value;\
    if (key.length > 10) \{ \
        console.log("Attempting to unlock premium with key:", key);\
        // localStorage.setItem('userApiKey', key); \
        // alert('Premium unlocked! (Placeholder - Replace with real logic)');\
    \} else \{\
        alert('Please enter a valid API key.');\
    \}\
\});\
\
sendBtn.addEventListener('click', () => \{\
    const message = userInput.value.trim();\
    if (message) \{\
        // 2. You need to insert your logic here to send the message to your AI model.\
        appendMessage(message, 'user');\
        userInput.value = '';\
\
        // Placeholder for AI Response (Replace with actual API call)\
        setTimeout(() => \{\
            // Example: cycle through sample responses or call your model\
            const currentResponse = sampleResponses.response1; \
            appendMessage(currentResponse, 'ai');\
        \}, 800);\
    \}\
\});\
\
// Helper function to append messages\
function appendMessage(text, sender) \{\
    const msgDiv = document.createElement('div');\
    msgDiv.classList.add(sender === 'user' ? 'user-input' : 'chat-response');\
    msgDiv.innerHTML = `<p>$\{text\}</p>`;\
    chatEchat.appendChild(msgDiv);\
    \
    // Scroll to the bottom of the chat box\
    chatEchat.scrollTop = chatEchat.scrollHeight;\
\}}