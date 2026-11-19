import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send,
  Sparkles,
  Bot,
  User,
  X,
  Cpu,
  RotateCcw,
} from 'lucide-react';
import { useShopping } from '../context/ShoppingContext';
import { aiService } from '../services/aiService';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/common/Button';
import MarkdownRenderer from '../components/common/MarkdownRenderer';

export const AIMode = () => {
  const { customerId } = useShopping();

  // Chat conversation ID (persists across message turns)
  const [conversationId] = useState(() => `conv_${Date.now()}`);

  // Chat message history
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "👋 Welcome to **ShopMate AI Mode**! I am your AI shopping assistant.\n\nTell me what you are looking for or describe your exact technical needs. For instance, ask me:\n- *\"Give me a laptop that can train AI models very well\"*\n- *\"Give me one laptop which has GPU, but price should be less than 80,000\"*\n- *\"Recommend a smart refrigerator or front-load washing machine for home\"*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pop-up overlay state for recommended products
  const [showRecommendationsPopup, setShowRecommendationsPopup] = useState(false);
  const [popupProducts, setPopupProducts] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Quick Starter Prompts
  const quickPrompts = [
    'Why is dedicated GPU required for AI model training instead of CPU?',
    'Give me a laptop that can train the AI model very well',
    'Give me one laptop which has GPU, but price should be less than 80,000',
    'Best double door smart refrigerator under ₹40,000',
    'Smartphone with flagship camera under ₹50,000',
  ];

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isProcessing) return;

    // RULE: If user does any chatting while the pop-up is open, dismiss it immediately!
    if (showRecommendationsPopup) {
      setShowRecommendationsPopup(false);
    }

    const userMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Call real Spring AI backend
      const response = await aiService.sendChatMessage({
        message: query,
        conversationId,
        customerId,
      });

      const responseText = response.message || response.responseText || 'Received response from AI agent.';
      const toolCalls = response.toolCalls || (response.toolCall ? [response.toolCall] : []);
      const products = response.recommendedProducts || response.products || [];

      const assistantMessage = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: responseText,
        toolCall: toolCalls[0] || null,
        products,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Display the pop-up with returned products if agent discovered matching products
      if (products && products.length > 0) {
        setPopupProducts(products);
        setShowRecommendationsPopup(true);
      } else {
        setShowRecommendationsPopup(false);
      }
    } catch (err) {
      console.warn('AI service request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          sender: 'assistant',
          text: `⚠️ **Service Temporarily Unavailable**\n\nWe are currently unable to reach our AI shopping assistant. Please try sending your message again in a moment.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const [searchParams] = useSearchParams();
  const initialQueryHandledRef = useRef(false);

  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam && !initialQueryHandledRef.current) {
      initialQueryHandledRef.current = true;
      handleSendMessage(qParam);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (showRecommendationsPopup) {
      setShowRecommendationsPopup(false);
    }
  };

  const handleInputFocus = () => {
    if (showRecommendationsPopup) {
      setShowRecommendationsPopup(false);
    }
  };

  const handleOpenPopupForMessage = (productsList) => {
    setPopupProducts(productsList);
    setShowRecommendationsPopup(true);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: "Chat cleared. What can I help you find today? Ask me about any laptop, home appliance, or smartphone requirements.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setShowRecommendationsPopup(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col justify-between max-w-5xl mx-auto space-y-4">
      {/* Top Header / Mode Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-taupe-200/80 dark:border-charcoal-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-charcoal-900 dark:text-white tracking-tight">
                AI Agent Shopping Mode
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sage-100 dark:bg-charcoal-800 text-sage-800 dark:text-sage-200 border border-sage-200/80 dark:border-charcoal-700">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse" />
                AI Assistant Active
              </span>
            </div>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
              Conversational product discovery with automated tool calling & instant recommendation pop-ups.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="text-xs text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-taupe-200 dark:border-charcoal-700 hover:bg-white dark:hover:bg-charcoal-800 transition-colors"
          title="Clear Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Chat Messages Timeline */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-2 max-h-[60vh] sm:max-h-[65vh]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-charcoal-800 text-white dark:bg-charcoal-700'
                    : 'bg-sage-600 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div className={`space-y-2 max-w-[85%] sm:max-w-2xl ${isUser ? 'text-right' : 'text-left'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-charcoal-900 text-white rounded-tr-none'
                      : 'bg-white dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-100 border border-taupe-200/80 dark:border-charcoal-700/80 shadow-sm rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <span className="whitespace-pre-line">{msg.text}</span>
                  ) : (
                    <MarkdownRenderer content={msg.text} />
                  )}
                </div>

                {/* If Assistant emitted a Tool Call */}
                {!isUser && msg.toolCall && (
                  <div className="p-2.5 rounded-xl bg-ivory-100/80 dark:bg-charcoal-900 border border-taupe-200/70 dark:border-charcoal-700 text-left text-[11px] font-mono text-charcoal-600 dark:text-charcoal-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sage-800 dark:text-sage-300">
                      <Cpu className="w-3.5 h-3.5 text-sage-600" />
                      <span>Tool Invoked: {msg.toolCall.tool}</span>
                    </div>
                    <div className="text-[10px] text-charcoal-500 overflow-x-auto">
                      args: {JSON.stringify(msg.toolCall.arguments)}
                    </div>
                  </div>
                )}

                {/* If message has returned products, provide a persistent button to re-summon pop-up */}
                {!isUser && msg.products && msg.products.length > 0 && (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPopupForMessage(msg.products)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-50 dark:bg-charcoal-800 border border-sage-200 dark:border-charcoal-700 text-sage-800 dark:text-sage-200 hover:bg-sage-100 dark:hover:bg-charcoal-700 transition-colors text-xs font-semibold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
                      <span>View Recommended Products ({msg.products.length})</span>
                    </button>
                    <span className="text-[10px] text-charcoal-400">
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                {isUser && (
                  <span className="text-[10px] text-charcoal-400 block pr-1">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-sage-600 text-white shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 flex items-center gap-2 text-xs text-charcoal-500">
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
              <span>Analyzing specifications & matching criteria...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* RECOMMENDED PRODUCTS POP-UP OVERLAY */}
      {showRecommendationsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 shadow-2xl overflow-hidden animate-scaleUp">
            {/* Pop-up Top Header with Close 'Wrong' Button at the RIGHT side */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-taupe-200/80 dark:border-charcoal-700/80 bg-ivory-50/70 dark:bg-charcoal-900/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-charcoal-800 text-sage-700 dark:text-sage-300 border border-sage-200/80 dark:border-charcoal-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-charcoal-900 dark:text-white">
                    AI Recommended Products
                  </h2>
                  <p className="text-xs text-charcoal-500">
                    {popupProducts.length} tailored recommendation(s)
                  </p>
                </div>
              </div>

              {/* Close Button on the RIGHT side */}
              <button
                type="button"
                onClick={() => setShowRecommendationsPopup(false)}
                className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 hover:bg-taupe-100 dark:hover:bg-charcoal-700 border border-transparent hover:border-taupe-200 transition-colors"
                aria-label="Dismiss recommendation pop-up"
                title="Dismiss"
              >
                <X className="w-5 h-5 text-charcoal-600 dark:text-charcoal-300" />
              </button>
            </div>

            {/* Pop-up Body: Product Cards Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-3 rounded-2xl bg-sage-50/70 dark:bg-charcoal-900/90 border border-sage-200/60 dark:border-charcoal-700 text-xs text-sage-800 dark:text-sage-200 flex items-center justify-between">
                <span>
                  💡 <strong>Tip:</strong> Click the <strong>✕</strong> button on the right to dismiss this pop-up, or <strong>simply start typing/chatting below</strong> and it will automatically disappear!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {popupProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id || idx}
                    product={product}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CHAT BAR */}
      <div className="pt-2 sticky bottom-0 bg-ivory-100/90 dark:bg-charcoal-900/90 backdrop-blur-md pb-2">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs text-charcoal-500">
          <span className="text-charcoal-400 shrink-0 font-medium">Quick Prompts:</span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-xl bg-white dark:bg-charcoal-800 border border-taupe-200/80 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-200 hover:border-sage-400 hover:text-sage-700 dark:hover:text-sage-300 shrink-0 transition-colors shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              disabled={isProcessing}
              placeholder="Ask for laptops with GPU under ₹80k, compare smart appliances, or ask tech questions..."
              className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-white dark:bg-charcoal-800 border border-taupe-300 dark:border-charcoal-700 text-xs sm:text-sm text-charcoal-900 dark:text-white placeholder:text-charcoal-400 shadow-sm focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 disabled:opacity-50 transition-all"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-charcoal-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            size="md"
            icon={Send}
            className="rounded-2xl px-5 py-3.5 shadow-sm text-xs sm:text-sm font-semibold shrink-0"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIMode;
