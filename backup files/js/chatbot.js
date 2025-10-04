// chatbot.js - AI-powered portfolio chatbot
// Replace with your actual Hugging Face token
const HUGGING_FACE_TOKEN = 'hf_odtuwEFLZznQboAADbfYCONJwTnRVsKnB';
const API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

// Portfolio information for context-aware responses
const portfolioData = {
  name: 'John Michael Banzuela',
  location: 'Pasig, Philippines',
  email: 'johnmichaelbanzuela15@gmail.com',
  phone: '0981 663 0397',
  experience: '1+ years',
  projects: '5+ projects completed',
  skills: {
    frontend: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    backend: ['Node.js', 'Python', 'PHP'],
    database: ['MongoDB', 'MySQL'],
    tools: ['Git', 'Docker', 'AWS', 'Figma']
  },
  interests: 'Creating innovative solutions, open-source projects, exploring new technologies'
};

// DOM elements
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const typingIndicator = document.getElementById('typingIndicator');

// Chat state
let conversationHistory = [];

// Event listeners
chatToggle.addEventListener('click', toggleChat);
chatClose.addEventListener('click', closeChat);
chatInput.addEventListener('input', autoResizeInput);
chatForm.addEventListener('submit', handleSubmit);
chatInput.addEventListener('keydown', handleEnterKey);

function toggleChat() {
  chatWidget.classList.add('active');
  chatInput.focus();
}

function closeChat() {
  chatWidget.classList.remove('active');
}

function autoResizeInput() {
  chatInput.style.height = '36px';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
}

function handleEnterKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, 'user');
  chatInput.value = '';
  chatInput.style.height = '36px';
  chatSend.disabled = true;
  showTyping();

  try {
    // Check for portfolio-specific questions first
    const quickResponse = getQuickResponse(message);
    if (quickResponse) {
      hideTyping();
      addMessage(quickResponse, 'ai');
      chatSend.disabled = false;
      chatInput.focus();
      return;
    }

    // Use AI for more complex responses
    const response = await getAIResponse(message);
    hideTyping();
    addMessage(response, 'ai');
  } catch (error) {
    console.error('Chat error:', error);
    hideTyping();
    addMessage('Sorry, I\'m having trouble connecting right now. Try asking about John Michael\'s <b>skills</b>, <b>experience</b>, or <b>contact information</b>!', 'error');
  } finally {
    chatSend.disabled = false;
    chatInput.focus();
  }
}

function getQuickResponse(message) {
  const msg = message.toLowerCase();
}
  // Contact information
  if (msg.includes('email') || msg.includes('contact')) {
    return `You can reach John Michael at ${portfolioData.email} or call ${portfolioData.phone}. He's based in ${portfolioData.location}.`;
  }
  
  // Skills
  if (msg.includes('skill') || msg.includes('technology') || msg.includes('tech stack')) {
    const allSkills = [
      ...portfolioData.skills.frontend,
      ...portfolioData.skills.backend,
      ...portfolioData.skills.database,
      ...portfolioData.skills.tools
    ];
    return `John Michael's skills include: ${allSkills.join(', ')}. He has ${portfolioData.experience} of experience and has completed ${portfolioData.projects}.`;
  }
  
  // Experience
  if (msg.includes('experience') || msg.includes('work') || msg.includes('job')) {
    return `John Michael has ${portfolioData.experience} in web development and has completed ${portfolioData.projects}. He specializes in full-stack development with modern technologies.`;
  }
  
  // Projects
  if (msg.includes('project') || msg.includes('portfolio') || msg.includes('work sample')) {
    return `John Michael has completed ${portfolioData.projects} using various technologies. You can view his featured projects in the Projects section above. He's passionate about ${portfolioData.interests}.`;
  }
  
  // Location
  if (msg.includes('location') || msg.includes('where') || msg.includes('based')) {
    return `John Michael is based in ${portfolioData.location}.`;
  }
  
  // Greeting responses
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hello! I'm John Michael's AI assistant. I can help you learn about his skills, experience, projects, or contact information. What would you like to know?`;
  }
 

async function getAIResponse(message) {
  // Create context-aware prompt
  const contextPrompt = `You are an AI assistant for John Michael Banzuela's portfolio website. 

About John Michael:
- Full-stack developer from ${portfolioData.location}
- Skills: ${Object.values(portfolioData.skills).flat().join(', ')}
- Experience: ${portfolioData.experience}
- Projects: ${portfolioData.projects}
- Contact: ${portfolioData.email}, ${portfolioData.phone}
- Interests: ${portfolioData.interests}

Please respond to this visitor question in a helpful, professional way: ${message}

Keep responses concise and focused on John Michael's qualifications and portfolio.`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: contextPrompt,
      parameters: {
        max_length: 150,
        temperature: 0.7,
        do_sample: true
      }
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  
  // Handle different response formats
  if (Array.isArray(data) && data[0] && data[0].generated_text) {
    return cleanResponse(data[0].generated_text);
  } else if (data.generated_text) {
    return cleanResponse(data.generated_text);
  } else {
    throw new Error('Unexpected response format');
  }
}

function cleanResponse(text) {
  // Remove the original prompt from the response if it's included
  const lines = text.split('\n');
  const responseStart = lines.findIndex(line => 
    line.includes('visitor question') || line.includes('Please respond')
  );
  
  if (responseStart !== -1 && responseStart < lines.length - 1) {
    return lines.slice(responseStart + 1).join('\n').trim();
  }
  
  // Fallback: just clean up the text
  return text.replace(/^.*?John Michael.*?:/i, '').trim() || 
         "I'd be happy to help you learn more about John Michael's background and skills!";
}

function addMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type === 'user' ? 'user-message' : type === 'error' ? 'error-message' : 'ai-message'}`;
  messageDiv.textContent = text;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Store in conversation history
  conversationHistory.push({ type, text, timestamp: Date.now() });
  
  // Limit history to last 20 messages
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }
}

function showTyping() {
  typingIndicator.style.display = 'block';
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  typingIndicator.style.display = 'none';
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
  // Add welcome message after a short delay
  setTimeout(() => {
    if (chatMessages.children.length <= 1) {
      addMessage("Feel free to ask me about John Michael's skills, experience, projects, or contact information!", 'ai');
    }
  }, 1000);
});