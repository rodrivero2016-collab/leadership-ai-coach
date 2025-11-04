let apiKey = '';
let freeQuestions = 5;
let questionsUsed = 0;
let isProcessing = false;

// Sample leadership responses based on the four texts (A.C.T. is J.Cuellar's philosophy)
const responseLibrary = {
    starfish: "<strong>The Starfish and the Spider</strong> by Brafman & Beckstrom teaches that decentralized organizations (starfish) are far more resilient than centralized ones (spiders). Cut off a spider's head, and it dies. Cut off a starfish's leg, and it grows a new one - the leg can even become a new starfish. This embodies <strong>Continuity</strong> from J.Cuellar's A.C.T. principles: when you distribute leadership rather than concentrate it, your organization survives disruptions. The book distinguishes between <strong>catalysts</strong> (who empower and inspire others) and <strong>CEOs</strong> (who control and direct). True resilience comes from decentralized power.",
    
    fm622: "Drawing from <strong>FM 6-22</strong> and Juan Cuellar's <strong>Accountability</strong> principle: Army leadership doctrine emphasizes the Be-Know-Do model. Your character (Be) must align with your competence (Know) to produce effective action (Do). The seven Army values - Loyalty, Duty, Respect, Selfless Service, Honor, Integrity, Personal Courage - form the foundation. <strong>Accountability</strong> begins with the leader taking personal responsibility first, then building systems that create <strong>Continuity</strong> in your team's performance.",
    
    startwithwhy: "<strong>Start With Why</strong> by Simon Sinek revolutionized how we think about leadership and inspiration. People don't buy what you do; they buy <strong>why</strong> you do it. The Golden Circle moves from Why → How → What, but most leaders communicate backwards (What → How → Why). This aligns with <strong>Transparency</strong> from A.C.T. - when you clearly communicate your purpose, you build trust. Great leaders inspire action by starting with why their work matters, not just what needs to be done.",
    
    littleblackbook: "Dr. Todd Dewett's <strong>Little Black Book of Leadership</strong> gives us three daily rules that embody the A.C.T. principles: <strong>Reduce Ambiguity</strong> (Transparency), <strong>Be Fair</strong> (Accountability), and <strong>Stay Positive</strong> (builds Continuity). Clear communication eliminates confusion. Fairness demonstrates integrity and builds trust. Positivity creates an environment where people thrive. As Dewett emphasizes: <em>Excellence is free - it comes from work ethic and attitude, not resources.</em>",
    
    general: "Leadership wisdom from our four core texts shows that great leaders combine <strong>accountability</strong> (taking personal responsibility), <strong>continuity</strong> (building resilient systems), and <strong>transparency</strong> (operating with clarity). Whether you're addressing team conflict, building trust, or developing future leaders, start with empathy and apply these proven principles from military doctrine, corporate wisdom, and leadership research."
};

function matchQuestionToResponse(question) {
    const q = question.toLowerCase();
    
    // Check for book-specific questions (flexible matching for typos)
    if (q.includes('starfish') || q.includes('spider') || q.includes('brafman') || q.includes('beckstrom')) {
        return responseLibrary.starfish;
    }
    if (q.includes('fm') || q.includes('6-22') || q.includes('622') || q.includes('army') || q.includes('military')) {
        return responseLibrary.fm622;
    }
    if (q.includes('start with why') || q.includes('sinek') || (q.includes('why') && (q.includes('start') || q.includes('simon')))) {
        return responseLibrary.startwithwhy;
    }
    // Flexible matching for "Little Black Book" - catches typos
    if (q.includes('little') || q.includes('dewett') || q.includes('todd') || 
        (q.includes('black') && q.includes('book')) || 
        (q.includes('leadership') && (q.includes('book') || q.includes('dewett')))) {
        return responseLibrary.littleblackbook;
    }
    
    // For general leadership questions
    return responseLibrary.general;
}

// Connect premium button
document.getElementById('unlock-premium-button').addEventListener('click', function() {
    const input = document.getElementById('api-key-input').value.trim();
    
    if (!input) {
        alert('Please enter an API key');
        return;
    }
    
    if (input.startsWith('sk-') && input.length > 20) {
        apiKey = input;
        document.querySelector('.premium-section').style.display = 'none';
        document.getElementById('ai-response-display').innerHTML = '<div style="background: #d4edda; padding: 12px; border-radius: 6px; color: #155724; border: 2px solid #c3e6cb;"><strong>✅ Premium Access Unlocked!</strong><br>Ask unlimited leadership questions based exclusively on the four texts and A.C.T. principles!</div>';
        questionsUsed = 0;
    } else {
        alert('Invalid API key format. OpenAI API keys start with "sk-" and are longer than 20 characters.');
    }
});

// Main Ask AI function
document.getElementById('ask-ai-button').addEventListener('click', askAI);

function askAI() {
    if (isProcessing) return;

    const question = document.getElementById('user-question-input').value.trim();
    
    if (!question) {
        alert('Please enter a question');
        return;
    }

    // Check if using free tier
    if (!apiKey) {
        if (questionsUsed >= freeQuestions) {
            alert('You\'ve used your 5 free questions today! Get unlimited access by adding your OpenAI API key above.');
            return;
        }
        
        questionsUsed++;
        
        // Add user message
        addMessage(question, 'user');
        
        // Simulate thinking delay
        setTimeout(() => {
            // Match the question to the appropriate response
            const response = matchQuestionToResponse(question);
            
            addMessage(response, 'ai-sample');
            
            // Show remaining questions
            const remaining = freeQuestions - questionsUsed;
            if (remaining > 0) {
                addWarning(`<strong>Free Tier:</strong> ${remaining} questions remaining today. Upgrade for unlimited personalized responses!`);
            } else {
                addError('<strong>Free Trial Complete!</strong> Add your OpenAI API key above for unlimited custom leadership coaching based on all four texts!');
            }
        }, 800);
        
        document.getElementById('user-question-input').value = '';
        return;
    }

    // Premium tier with API key
    isProcessing = true;
    document.getElementById('ask-ai-button').disabled = true;
    document.getElementById('ask-ai-button').textContent = 'Analyzing...';
    
    addMessage(question, 'user');
    const thinkingMsg = addMessage('🤔 Consulting the four leadership texts and A.C.T. principles...', 'ai-thinking');
    
    callOpenAI(question, thinkingMsg);
    
    document.getElementById('user-question-input').value = '';
}

async function callOpenAI(question, thinkingMsg) {
    const systemPrompt = `You are an expert leadership consultant trained EXCLUSIVELY on these four texts:

1. **FM 6-22: Army Leadership** - Military doctrine emphasizing Be-Know-Do model and Army values (Loyalty, Duty, Respect, Selfless Service, Honor, Integrity, Personal Courage)

2. **Start With Why by Simon Sinek** - People don't buy what you do; they buy why you do it. The Golden Circle: Why → How → What. Inspire action through purpose.

3. **The Starfish and the Spider by Ori Brafman & Rod Beckstrom** - Decentralized organizations (starfish) are more resilient than centralized ones (spiders). Catalysts vs. CEOs. Distributed leadership.

4. **Little Black Book of Leadership by Dr. Todd Dewett** - Three daily rules: Reduce Ambiguity, Be Fair, Stay Positive. Excellence is free - it comes from work ethic and attitude.

You also apply Juan Cuellar's **A.C.T. principles**:
- **Accountability**: Leadership starts and ends with personal responsibility
- **Continuity**: Build resilient systems that maintain momentum  
- **Transparency**: Operate with clarity for stakeholder trust

"Leadership must start at the point of empathy" (J.Cuellar)

Draw from these sources ONLY. Be specific about which text supports your advice. Connect concepts to the A.C.T. principles where relevant.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ],
                max_tokens: 400,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'API error occurred');
        }
        
        thinkingMsg.remove();
        addMessage(data.choices[0].message.content, 'ai-premium');
    } catch (error) {
        console.error('Error:', error);
        thinkingMsg.remove();
        addError(`❌ <strong>Error:</strong> ${error.message}. Please check your API key and try again.`);
    } finally {
        isProcessing = false;
        document.getElementById('ask-ai-button').disabled = false;
        document.getElementById('ask-ai-button').textContent = 'Ask Leadership AI';
    }
}

function addMessage(text, type) {
    const chatDiv = document.getElementById('ai-response-display');
    const msgDiv = document.createElement('div');
    
    if (type === 'user') {
        msgDiv.className = 'message user-message';
        msgDiv.innerHTML = `<strong>You:</strong> ${text}`;
    } else if (type.startsWith('ai')) {
        msgDiv.className = 'message ai-message';
        const label = type === 'ai-premium' ? '🎯 Cum Corde Leadership AI' : '🎯 Leadership AI (Sample)';
        msgDiv.innerHTML = `<strong>${label}:</strong> ${text}`;
    }
    
    chatDiv.appendChild(msgDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
    return msgDiv;
}

function addWarning(text) {
    const chatDiv = document.getElementById('ai-response-display');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'warning-message';
    msgDiv.innerHTML = text;
    chatDiv.appendChild(msgDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function addError(text) {
    const chatDiv = document.getElementById('ai-response-display');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'error-message';
    msgDiv.innerHTML = text;
    chatDiv.appendChild(msgDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}
