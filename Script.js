// === CONFIGURATION ===
const ASSISTANT_ID = 'asst_hCS1uSyDvfeS1Zk1sFmXxWT4';
let API_KEY = null;
let THREAD_ID = null;
let isProcessing = false;

// === QUESTION TRACKING ===
const MAX_FREE_QUESTIONS = 5;

function getQuestionCount() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('leadershipAI_date');
    const count = parseInt(localStorage.getItem('leadershipAI_count')) || 0;
    
    if (stored !== today) {
        localStorage.setItem('leadershipAI_date', today);
        localStorage.setItem('leadershipAI_count', '0');
        return 0;
    }
    return count;
}

function incrementQuestionCount() {
    const count = getQuestionCount() + 1;
    localStorage.setItem('leadershipAI_count', count.toString());
    return count;
}

function getRemainingQuestions() {
    return MAX_FREE_QUESTIONS - getQuestionCount();
}

// === DOM ELEMENTS ===
const apiKeyInput = document.getElementById('apiKey');
const unlockBtn = document.getElementById('unlock-btn');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('send-btn');
const chatArea = document.getElementById('chat-area');

// === PRE-WRITTEN ANSWERS FOR FREE TIER ===
const FREE_ANSWERS = {
    "startwhy_sinek": {
        keywords: ["start with why", "simon sinek", "sinek", "golden circle", "why how what", "inspire people", "purpose driven", "start why"],
        answer: `Based on Simon Sinek's "Start With Why" principles, effective leaders inspire action by communicating their purpose first. Focus on why your team's work matters, not just what they need to do. This creates intrinsic motivation that drives performance.

When you start with why, people aren't just completing tasks—they're contributing to a meaningful mission. Sinek's Golden Circle framework (Why → How → What) shows that inspiring leaders work from the inside out, beginning with purpose rather than ending with it.

This aligns perfectly with Juan Cuellar's principle that "Leadership must start at the point of empathy"—understanding and communicating the deeper purpose connects emotionally with your team.`
    },
    
    "starfish_spider": {
        keywords: ["starfish and spider", "starfish spider", "starfish", "starfish", "spider", "decentralized", "centralized", "brafman", "beckstrom", "catalyst", "distributed", "starfish and spider", "starfish spider"],
        answer: `Based on "The Starfish and the Spider" by Ori Brafman and Rod Beckstrom, this book explores the power of decentralized leadership. Like a starfish that regenerates when cut, decentralized organizations distribute power throughout the network rather than concentrating it at the top.

Traditional "spider" organizations have a central brain—cut off the head, and the organization dies. But "starfish" organizations have no single leader controlling everything. Power is distributed, making them incredibly resilient and adaptive. Examples include Wikipedia, Alcoholics Anonymous, and Apache tribes.

This model aligns with Juan Cuellar's A.C.T. Framework—decentralization requires tremendous transparency and accountability at every level, with continuity built into the system rather than dependent on one leader.`
    },
    
    "army_leadership": {
        keywords: ["army", "military", "fm 6-22", "fm 622", "fm6-22", "army leadership", "army values", "be know do", "ldrship", "soldier", "military leadership", "doctrine"],
        answer: `Based on FM 6-22: Army Leadership doctrine, effective military leadership is built on three pillars: Lead (influence others), Develop (improve self and others), and Achieve (accomplish the mission).

Army leadership emphasizes that leadership is a process of influencing people by providing purpose, direction, and motivation to accomplish the mission and improve the organization. Character and competence are equally essential—you need both to be an effective leader.

The Army Leadership Requirements Model includes attributes (what a leader is) and competencies (what a leader does). The seven Army Values—Loyalty, Duty, Respect, Selfless Service, Honor, Integrity, and Personal Courage (LDRSHIP)—form the foundation. Juan Cuellar's A.C.T. Framework (Accountability, Continuity, Transparency) aligns perfectly with these values.`
    },
    
    "levels_leadership": {
        keywords: ["5 levels", "five levels", "todd dewett", "dewett", "little black book", "leadership levels", "position permission production"],
        answer: `Based on leadership progression principles (similar to those in "The Little Black Book of Leadership" by Dr. Todd Dewett), leadership typically develops through distinct levels:

Level 1 - Position: People follow because they have to. Authority comes from title alone.
Level 2 - Permission: People follow because they want to. Built on relationships and trust.
Level 3 - Production: People follow because of results. Credibility comes from accomplishments.
Level 4 - People Development: People follow because of what you've done for them.
Level 5 - Pinnacle: People follow because of who you are and what you represent.

The key insight: you can't skip levels. You must build trust (Level 2) before you can lead through production (Level 3). This aligns with Juan Cuellar's principle that leadership starts with empathy—without genuine care for people, sustainable leadership is impossible.`
    },
    
    "act_framework": {
        keywords: ["act framework", "a.c.t.", "act", "accountability continuity transparency", "juan cuellar", "cuellar"],
        answer: `Juan Cuellar's A.C.T. Framework stands for Accountability, Continuity, and Transparency—three pillars of effective leadership:

**Accountability**: Starts and ends with the leader. By taking ownership of outcomes, leaders set the standard for the entire organization. Everyone becomes accountable when the leader models it first.

**Continuity**: Building systems and processes that maintain organizational effectiveness regardless of personnel changes. The organization's heartbeat continues even when individuals come and go.

**Transparency**: Acting openly so all stakeholders—internal and external—trust the organization's integrity. Transparent leaders eliminate doubt about motivations and decisions.

This framework integrates beautifully with all four books in your library: Sinek's "why" requires transparency, decentralized starfish organizations need all three elements, Army Leadership emphasizes accountability and continuity, and leadership development demands transparent feedback.`
    },
    
    "empathy": {
        keywords: ["empathy", "empathetic", "understanding people", "care about people", "emotional intelligence"],
        answer: `Leadership that starts with empathy—a core principle emphasized by Juan Cuellar—means understanding people's perspectives, emotions, and motivations before attempting to lead them.

Empathy in leadership involves: 1) Active listening without judgment, 2) Seeking to understand before being understood, 3) Recognizing that people have different backgrounds and needs, and 4) Leading with compassion while maintaining accountability.

This principle appears across all four leadership books: Sinek's "Start With Why" shows that understanding what motivates people emotionally drives inspiration. "The Starfish and the Spider" demonstrates that catalyst leaders succeed through genuine interest in others. Army Leadership emphasizes knowing your people. And leadership development frameworks stress that relationship-building precedes results.

Empathy doesn't mean being soft—it means being effective. When you understand what drives your team, you can align their motivations with organizational goals.`
    },
    
    "trust": {
        keywords: ["trust", "build trust", "building trust", "trustworthy", "credibility"],
        answer: `Building trust is fundamental to effective leadership and appears as a core principle across all four books in your library.

**From "Start With Why"**: Trust comes from consistency between what you say (your "why") and what you do. When leaders authentically communicate and live their purpose, people trust them.

**From "The Starfish and the Spider"**: In decentralized organizations, trust replaces control. Catalyst leaders build trust by empowering others and getting out of the way.

**From Army Leadership**: The Be-Know-Do framework emphasizes that character (BE) and competence (KNOW) build the trust necessary to lead (DO). Army Values like integrity and honor are trust-builders.

**From Leadership Development**: Trust is earned at Level 2 (Permission) and must precede production results. Without it, leadership is impossible.

Juan Cuellar's A.C.T. Framework reinforces this: Accountability builds trust through ownership, Continuity through reliability, and Transparency through openness.`
    },
    
    "communication": {
        keywords: ["communication", "communicate", "how to communicate", "talking to team", "message", "speaking"],
        answer: `Effective communication is essential for leadership and each of your four books addresses it differently:

**From "Start With Why"**: Communicate the "why" before the "what." People need to understand purpose and meaning before they care about tasks and processes. The Golden Circle shows that inspiring communication works inside-out.

**From "The Starfish and the Spider"**: In decentralized organizations, communication must be open and distributed. Information flows freely rather than being controlled from the top.

**From Army Leadership**: Leaders provide purpose, direction, and motivation through clear, direct communication. The "commander's intent" ensures everyone understands the mission even when plans change.

**From Leadership Development**: Communication builds trust (Level 2) and enables results (Level 3). Frequency and clarity matter more than eloquence.

Juan Cuellar's Transparency principle (from A.C.T. Framework) emphasizes that open communication builds organizational trust.`
    },
    
    "motivation": {
        keywords: ["motivation", "motivate", "motivating people", "inspire", "engagement"],
        answer: `Motivation is central to effective leadership, and your four books offer complementary perspectives:

**From "Start With Why"**: Intrinsic motivation comes from understanding purpose. When people know "why" their work matters, they become self-motivated. External rewards (carrots and sticks) create compliance, not commitment.

**From "The Starfish and the Spider"**: Decentralized organizations tap into intrinsic motivation by giving people autonomy and ownership. When people feel empowered rather than controlled, motivation increases naturally.

**From Army Leadership**: Leaders motivate by providing purpose, direction, and inspiration. The mission gives meaning, the plan gives direction, and the leader's example gives inspiration.

**From Leadership Development**: Motivation follows relationships. At Level 2 (Permission), people become motivated because they genuinely want to follow. At Level 4 (People Development), they're motivated by growth opportunities.

Juan Cuellar's principle that "leadership starts with empathy" is key—understanding what motivates each person individually allows you to align their drivers with organizational goals.`
    },
    
    "default": {
        keywords: ["default"],
        answer: `I can help you with leadership questions based on four specific books:

1. **"Start With Why" by Simon Sinek** - Purpose-driven leadership, the Golden Circle, inspiring action
2. **"The Starfish and the Spider" by Ori Brafman & Rod Beckstrom** - Decentralized organizations, catalyst leadership
3. **FM 6-22: Army Leadership** - Military leadership doctrine, Be-Know-Do, Army Values
4. **Leadership Development Principles** - Building trust, developing others, practical leadership skills

Try asking about:
- "What is Start With Why about?"
- "Tell me about decentralized leadership"
- "What are the Army leadership values?"
- "How do I build trust as a leader?"
- "Explain the A.C.T. Framework"

Each book offers unique insights that can transform how you lead.`
    }
};

// === SHOW FREE TIER DISCLOSURE ON LOAD ===
window.addEventListener('DOMContentLoaded', () => {
    const remaining = getRemainingQuestions();
    const disclosure = document.createElement('div');
    disclosure.className = 'warning-note';
    disclosure.style.marginTop = '10px';
    disclosure.innerHTML = `
        <strong>📋 Free Tier Notice:</strong> You have <strong>${remaining} free questions</strong> remaining today. 
        Free responses use pre-written answers covering 10-15 common questions about each book. 
        For unlimited AI-powered responses from all four books, add your OpenAI API key below.
    `;
    chatArea.insertBefore(disclosure, chatArea.firstChild);
});

// === UNLOCK PREMIUM ===
unlockBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key.startsWith('sk-') && key.length > 20) {
        API_KEY = key;
        apiKeyInput.value = '';
        apiKeyInput.type = 'text';
        apiKeyInput.value = '✓ Premium Unlocked!';
        apiKeyInput.disabled = true;
        unlockBtn.disabled = true;
        unlockBtn.textContent = '✓ Premium Active';
        unlockBtn.style.backgroundColor = '#28a745';
        
        appendMessage('🎉 Premium unlocked! You now have unlimited AI-powered access to all four leadership books with personalized, dynamic responses.', 'ai');
    } else {
        alert('Please enter a valid OpenAI API key (starts with sk-)');
    }
});

// === SEND MESSAGE ===
sendBtn.addEventListener('click', () => {
    if (isProcessing) return;
    
    const message = userInput.value.trim();
    if (!message) return;
    
    appendMessage(message, 'user');
    userInput.value = '';
    
    getAIResponse(message);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isProcessing) {
        sendBtn.click();
    }
});

// === MAIN AI FUNCTION ===
async function getAIResponse(userMessage) {
    isProcessing = true;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Thinking...';
    
    try {
        // FREE TIER: Use pre-written answers if no API key
        if (!API_KEY) {
            const remaining = getRemainingQuestions();
            
            if (remaining <= 0) {
                appendMessage('⚠️ You\'ve reached your 5 free questions for today. Questions reset daily at midnight. To continue, please add your OpenAI API key above for unlimited access.', 'ai');
                return;
            }
            
            // Find matching pre-written answer
            const answer = findFreeAnswer(userMessage);
            appendMessage(answer, 'ai');
            
            // Increment and show remaining
            const newRemaining = MAX_FREE_QUESTIONS - incrementQuestionCount();
            if (newRemaining > 0) {
                appendMessage(`💡 You have ${newRemaining} free questions remaining today. For unlimited AI-powered responses, add your OpenAI API key above.`, 'ai');
            } else {
                appendMessage('⚠️ You\'ve used all 5 free questions for today. Add your OpenAI API key above for unlimited access, or return tomorrow for 5 more free questions.', 'ai');
            }
            
            return;
        }
        
        // PREMIUM TIER: Full AI responses
        if (!THREAD_ID) {
            THREAD_ID = await createThread();
        }
        
        await addMessageToThread(userMessage);
        const runId = await runAssistant();
        const response = await waitForCompletion(runId);
        appendMessage(response, 'ai');
        
    } catch (error) {
        console.error('Error:', error);
        appendMessage(`❌ Error: ${error.message}. Please check your API key and try again.`, 'ai');
    } finally {
        isProcessing = false;
        sendBtn.disabled = false;
        sendBtn.textContent = 'Ask Leadership AI';
    }
}

// === FIND PRE-WRITTEN ANSWER (IMPROVED VERSION) ===
function findFreeAnswer(question) {
    const q = question.toLowerCase();
    
    // Sort answers by keyword length (longest first) to match more specific terms first
    const sortedAnswers = Object.entries(FREE_ANSWERS)
        .filter(([key]) => key !== 'default')
        .sort((a, b) => {
            // Get longest keyword from each answer
            const maxLengthA = Math.max(...a[1].keywords.map(k => k.length));
            const maxLengthB = Math.max(...b[1].keywords.map(k => k.length));
            return maxLengthB - maxLengthA;
        });
    
    // Check each answer's keywords
    for (const [key, data] of sortedAnswers) {
        for (const keyword of data.keywords) {
            // Check if keyword appears as whole word or phrase
            const regex = new RegExp('\\b' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
            if (regex.test(q) || q.includes(keyword)) {
                return data.answer;
            }
        }
    }
    
    // Return default if no match
    return FREE_ANSWERS['default'].answer;
}

// === ASSISTANTS API FUNCTIONS ===
async function createThread() {
    const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        }
    });
    
    if (!response.ok) throw new Error('Failed to create thread');
    const data = await response.json();
    return data.id;
}

async function addMessageToThread(content) {
    const response = await fetch(`https://api.openai.com/v1/threads/${THREAD_ID}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
            role: 'user',
            content: content
        })
    });
    
    if (!response.ok) throw new Error('Failed to add message');
    return await response.json();
}

async function runAssistant() {
    const response = await fetch(`https://api.openai.com/v1/threads/${THREAD_ID}/runs`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
            assistant_id: ASSISTANT_ID,
            instructions: `You are a Leadership AI Coach with deep expertise in four specific leadership books. Your job is to provide book-specific, tailored answers.

CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:

1. IDENTIFY THE BOOK FIRST:
   - Keywords "Start With Why" OR "Simon Sinek" OR "purpose" OR "why" → Use "Start With Why"
   - Keywords "Starfish" OR "Spider" OR "decentralized" OR "Brafman" OR "Beckstrom" → Use "The Starfish and the Spider"
   - Keywords "Army" OR "FM 6-22" OR "military leadership" OR "doctrine" → Use "FM 6-22: Army Leadership"
   - Keywords "5 Levels" OR "Todd Dewett" OR "Little Black Book" → Use "Little Black Book of Leadership"
   - If NO specific book mentioned, search ALL books and cite which one you're using

2. ANSWER REQUIREMENTS:
   ✓ ALWAYS start by stating: "Based on [Book Name] by [Author]..."
   ✓ Use ONLY content from that specific book
   ✓ Cite specific concepts, frameworks, examples, and principles from the book
   ✓ Give practical, actionable advice based on book content
   ✓ Integrate Juan Cuellar's A.C.T. Framework where relevant (Accountability, Continuity, Transparency)
   ✓ Apply the principle: "Leadership must start at the point of empathy"
   ✓ Keep responses conversational but substantive (2-4 paragraphs)

3. WHAT YOU MUST NEVER DO:
   ✗ NEVER give generic AI responses not from the books
   ✗ NEVER give the same answer for different books
   ✗ NEVER mix content from multiple books unless asked to compare
   ✗ NEVER answer without first searching the relevant book content
   ✗ NEVER make up book content - only use what's actually in the uploaded files

4. RESPONSE FORMAT:
   Line 1: "Based on [Book Title] by [Author]..."
   Lines 2-4: Specific concepts, frameworks, and examples from that book
   Final lines: Practical application to the user's question

Now carefully read the user's question, identify which book they're asking about, and provide a specific, book-grounded answer.`
        })
    });
    
    if (!response.ok) throw new Error('Failed to run assistant');
    const data = await response.json();
    return data.id;
}

async function waitForCompletion(runId) {
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
        const response = await fetch(`https://api.openai.com/v1/threads/${THREAD_ID}/runs/${runId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        });
        
        if (!response.ok) throw new Error('Failed to check run status');
        const run = await response.json();
        
        if (run.status === 'completed') {
            return await getLatestMessage();
        } else if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
            throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
    }
    
    throw new Error('Response timeout - please try again');
}

async function getLatestMessage() {
    const response = await fetch(`https://api.openai.com/v1/threads/${THREAD_ID}/messages?limit=1`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'
        }
    });
    
    if (!response.ok) throw new Error('Failed to get messages');
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
        const message = data.data[0];
        if (message.content && message.content[0] && message.content[0].text) {
            return message.content[0].text.value;
        }
    }
    
    throw new Error('No response from assistant');
}

// === DISPLAY HELPER ===
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(sender === 'user' ? 'user-input' : 'chat-response');
    
    const formattedText = text.replace(/\n/g, '<br>');
    msgDiv.innerHTML = `<p>${formattedText}</p>`;
    
    chatArea.insertBefore(msgDiv, userInput);
    msgDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
