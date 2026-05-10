import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';
import './AIChatbot.css';

const aiResponses = {
  'visa': "For US citizens traveling to Japan, you don't need a visa for stays up to 90 days! Just bring your valid passport. For Europe (Schengen Area), same deal — 90 days visa-free. 🛂",
  'restaurant': "Based on your Rome itinerary, I'd recommend:\n\n🍝 **Da Enzo al 29** — Best carbonara in Trastevere ($15)\n🍕 **Pizzarium** — Gourmet pizza al taglio near Vatican ($8)\n🌿 **Roscioli** — Amazing deli & wine bar ($25)\n\nAll within walking distance of your planned stops!",
  'weather': "Here's the forecast for your trip dates:\n\n🗼 **Paris (Jun 12-16):** ☀️ 22-26°C, mostly sunny. Pack light layers.\n🏛️ **Rome (Jun 17-21):** 🌤️ 28-32°C, hot! Bring sunscreen.\n🎨 **Florence (Jun 22-25):** ⛅ 25-30°C, chance of afternoon showers.\n\nI've updated your packing list suggestions accordingly!",
  'budget': "Looking at your current trip budget:\n\n💰 You've allocated $23,000 total\n📊 Flights take up 52% — that's high!\n\n**AI Suggestion:** Book Rome→Florence by train (€35 vs €120 flight). You'd save ~$85 AND enjoy the scenic Tuscan countryside. 🚂",
  'activity': "Based on your interest in history and food, here are my top picks for Rome:\n\n1. 🏛️ **Borghese Gallery** — Book 2 weeks ahead, it sells out! ($15)\n2. 🍷 **Trastevere Food Tour** — 3hrs, best local spots ($65)\n3. ⚔️ **Gladiator School** — Yes, it's real! Learn sword fighting ($55)\n\nWant me to add any of these to Day 3?",
  'default': "I'm your AI travel concierge! I can help with:\n\n✈️ Visa & travel requirements\n🍽️ Restaurant recommendations\n🌤️ Weather forecasts\n💰 Budget optimization tips\n🎯 Activity suggestions\n📦 Packing advice\n\nJust ask me anything about your trip!"
};

function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('visa') || lower.includes('passport') || lower.includes('document')) return aiResponses.visa;
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('eat') || lower.includes('dinner')) return aiResponses.restaurant;
  if (lower.includes('weather') || lower.includes('temperature') || lower.includes('rain') || lower.includes('forecast')) return aiResponses.weather;
  if (lower.includes('budget') || lower.includes('money') || lower.includes('save') || lower.includes('cost') || lower.includes('expensive')) return aiResponses.budget;
  if (lower.includes('activity') || lower.includes('thing') || lower.includes('do') || lower.includes('recommend') || lower.includes('suggest')) return aiResponses.activity;
  return aiResponses.default;
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! 👋 I'm your AI travel concierge. Ask me anything about your trip — visa info, restaurant picks, weather, or budget tips!" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const quickActions = [
    { label: '🌤️ Weather', prompt: 'What will the weather be like on my trip?' },
    { label: '💰 Budget tips', prompt: 'How can I save money on my trip?' },
    { label: '🍽️ Restaurants', prompt: 'Recommend restaurants near my itinerary' },
    { label: '✈️ Visa info', prompt: 'What are the visa requirements?' },
  ];

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const aiReply = { role: 'ai', text: getAIResponse(text) };
      setMessages(prev => [...prev, aiReply]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <>
      <button className={`chatbot-fab ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <><Sparkles size={18} className="chatbot-sparkle" /><MessageCircle size={22} /></>}
      </button>

      {open && (
        <div className="chatbot-window animate-in">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar"><Bot size={18} /></div>
              <div>
                <strong>AI Travel Concierge</strong>
                <span className="chatbot-status">● Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}><X size={16} /></button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.role === 'ai' && <div className="chat-msg-avatar"><Bot size={14} /></div>}
                <div className="chat-msg-bubble">
                  {msg.text.split('\n').map((line, li) => (
                    <span key={li}>{line.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}{li < msg.text.split('\n').length - 1 && <br/>}</span>
                  ))}
                </div>
                {msg.role === 'user' && <div className="chat-msg-avatar user"><User size={14} /></div>}
              </div>
            ))}
            {typing && (
              <div className="chat-msg ai">
                <div className="chat-msg-avatar"><Bot size={14} /></div>
                <div className="chat-msg-bubble typing">
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="chatbot-quick">
              {quickActions.map((qa, i) => (
                <button key={i} className="quick-btn" onClick={() => sendMessage(qa.prompt)}>{qa.label}</button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask me anything..."
              disabled={typing}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || typing}><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
