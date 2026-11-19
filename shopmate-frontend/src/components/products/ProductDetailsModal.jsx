import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Send,
  Bot,
  User,
  Eye,
} from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { aiService } from '../../services/aiService';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import MarkdownRenderer from '../common/MarkdownRenderer';

export const ProductDetailsModal = () => {
  const {
    selectedProductForModal,
    openProductModal,
    closeProductModal,
    toggleSaveProduct,
    isProductSaved,
  } = useShopping();

  // In-Product AI Drawer State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const product = selectedProductForModal;
  const isSaved = product ? isProductSaved(product.id) : false;

  // Initialize/reset in-product AI context when active product changes
  useEffect(() => {
    if (product) {
      setChatMessages([
        {
          id: 'ai-init',
          sender: 'assistant',
          text: `👋 I have full context on the **${product.name}** (${formatCurrency(product.price)}).\n\nAsk me anything: how its performance stacks up, why this product is better, or ask me to compare it with any other model or find alternatives!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setChatInput('');
      setIsAiThinking(false);
    }
  }, [product?.id]);

  useEffect(() => {
    if (isAiDrawerOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiDrawerOpen, isAiThinking]);

  if (!product) return null;

  // Context-tailored starter chips for this active product
  const starterChips = [
    'What is the performance of this?',
    'Why is this product better than others?',
    product.category === 'laptops'
      ? 'Can this train AI models?'
      : 'How energy efficient is this?',
    'Show me alternatives to this',
  ];

  // In-Product AI Chat calling Spring AI backend
  const handleSendChatMessage = async (queryText) => {
    const text = (queryText || chatInput).trim();
    if (!text || isAiThinking) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiThinking(true);

    try {
      // Call Spring AI in-product contextual endpoint
      const response = await aiService.sendProductChatMessage({
        productId: product.id,
        message: text,
      });

      const responseText = response.message || response.text || 'Assistant evaluated product hardware.';
      const toolCalls = response.toolCalls || (response.toolCall ? [response.toolCall] : []);
      const suggestedProducts = response.suggestedProducts || response.products || [];

      // If Spring AI executed save_product action
      if (response.actionExecuted === 'save_product' || toolCalls.some((t) => t.tool === 'save_product')) {
        if (!isSaved) {
          toggleSaveProduct(product);
        }
      }

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: responseText,
        toolCall: toolCalls[0] || null,
        products: suggestedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('In-product AI error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          sender: 'assistant',
          text: `⚠️ **Assistant Unavailable**\n\nUnable to connect to the product assistant right now. Please try again in a few moments.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Core specs for the metric cards
  const getCoreHardwareSpecs = () => {
    const items = [];
    if (product.hasDedicatedGpu || product.gpuModel) {
      items.push({
        label: 'Dedicated GPU',
        value: product.gpuModel || product.specs?.graphics,
        badge: 'AI & Tensor Cores',
      });
    } else if (product.specs?.graphics) {
      items.push({
        label: 'Graphics',
        value: product.specs.graphics.split('(')[0],
        badge: 'Integrated',
      });
    }

    if (product.specs?.processor) {
      items.push({
        label: 'Processor',
        value: product.specs.processor.split('(')[0],
        badge: 'CPU',
      });
    }

    if (product.specs?.ram) {
      items.push({
        label: 'Memory',
        value: product.specs.ram.split('(')[0],
        badge: 'RAM',
      });
    }

    if (product.specs?.storage) {
      items.push({
        label: 'Storage',
        value: product.specs.storage,
        badge: 'SSD',
      });
    }

    if (product.specs?.display) {
      items.push({
        label: 'Display',
        value: product.specs.display.split(',')[0],
        badge: 'Screen',
      });
    }

    if (product.specs?.capacity) {
      items.push({
        label: 'Capacity',
        value: product.specs.capacity.split('(')[0],
        badge: 'Volume',
      });
    }

    if (product.specs?.energyRating) {
      items.push({
        label: 'Efficiency',
        value: product.specs.energyRating.split('(')[0],
        badge: 'Rating',
      });
    }

    if (product.specs?.motor || product.specs?.power || product.specs?.compressor || product.specs?.suctionPower) {
      const val = product.specs.motor || product.specs.power || product.specs.compressor || product.specs.suctionPower;
      items.push({
        label: 'Performance',
        value: val.split('(')[0],
        badge: 'Engine',
      });
    }

    if (product.specs?.battery) {
      items.push({
        label: 'Battery / Power',
        value: product.specs.battery.split(',')[0],
        badge: 'Power',
      });
    }

    return items;
  };

  const coreSpecs = getCoreHardwareSpecs();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-charcoal-900 animate-fadeIn flex flex-col">
        {/* Top Sticky Header: ONLY ONE clean navigation back option */}
        <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-taupe-200/80 dark:border-charcoal-800 px-4 sm:px-8 h-16 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={closeProductModal}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-charcoal-700 dark:text-charcoal-200 hover:text-sage-700 dark:hover:text-sage-300 px-3 py-2 rounded-xl hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
        </header>

        {/* Content Container: Splits when AI Drawer is Open */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Product Presentation (Left Pane) */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Top Hero Section: Large Image + Core Meta & Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Large Product Image */}
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-ivory-100 dark:bg-charcoal-800 border border-taupe-200/80 dark:border-charcoal-700 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Core Meta, Price, and Actions */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider text-charcoal-500 font-bold px-2.5 py-0.5 rounded-lg bg-ivory-100 dark:bg-charcoal-800 border border-taupe-200/60 dark:border-charcoal-700">
                        {product.brand}
                      </span>
                      {product.badge && (
                        <span className="text-xs font-semibold text-sage-800 dark:text-sage-200 bg-sage-100 dark:bg-charcoal-800 border border-sage-200/80 dark:border-charcoal-700 px-2.5 py-0.5 rounded-full">
                          {product.badge}
                        </span>
                      )}
                      {product.matchScore && (
                        <span className="text-xs font-bold text-sage-700 dark:text-sage-400">
                          {product.matchScore}% Match
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 dark:text-white leading-tight">
                      {product.name}
                    </h1>

                    {/* Clean Price */}
                    <div className="flex items-baseline gap-3 pt-1">
                      <span className="text-3xl font-extrabold text-charcoal-900 dark:text-white tracking-tight">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-base text-charcoal-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                      {product.discountPercent && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-terracotta-100 text-terracotta-700 dark:bg-charcoal-800 dark:text-terracotta-300 border border-terracotta-200/80 dark:border-charcoal-700">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="text-xs text-charcoal-500 pt-1">
                      Status: <strong className="text-sage-700 dark:text-sage-400 font-semibold">{product.availability || 'In Stock'}</strong>
                    </div>
                  </div>

                  {/* Clean Action Buttons: ONLY ONE "Ask AI" button */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {product.externalUrl && (
                      <a
                        href={product.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px]"
                      >
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full text-xs sm:text-sm py-3 justify-center font-semibold"
                          icon={ExternalLink}
                          iconPosition="right"
                        >
                          Buy on {product.retailer?.split(' ')[0] || 'Store'}
                        </Button>
                      </a>
                    )}

                    <Button
                      variant={isAiDrawerOpen ? 'primary' : 'outline'}
                      size="md"
                      onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
                      icon={Sparkles}
                      className="text-xs sm:text-sm py-3 border-sage-300 dark:border-charcoal-700 text-sage-800 dark:text-sage-200 hover:bg-sage-50 dark:hover:bg-charcoal-800 font-semibold"
                    >
                      {isAiDrawerOpen ? 'Close AI Assistant' : 'Ask AI About This'}
                    </Button>

                    <Button
                      variant={isSaved ? 'secondary' : 'outline'}
                      size="md"
                      onClick={() => toggleSaveProduct(product)}
                      icon={Bookmark}
                      className="text-xs sm:text-sm py-3"
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Hardware Highlights Metric Cards Grid */}
              {coreSpecs.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                    Key Hardware Specifications
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {coreSpecs.map((spec, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-800 border border-taupe-200/80 dark:border-charcoal-700 shadow-sm space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider">
                          <span>{spec.label}</span>
                          <span className="px-1.5 py-0.5 rounded bg-ivory-100 dark:bg-charcoal-700 text-sage-800 dark:text-sage-200 border border-taupe-200/50 dark:border-charcoal-600">
                            {spec.badge}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-charcoal-900 dark:text-white truncate" title={spec.value}>
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommendation Summary */}
              {product.aiReasoning && (
                <div className="p-5 rounded-2xl bg-sage-50/70 dark:bg-charcoal-800/80 border border-sage-200/60 dark:border-charcoal-700 text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sage-800 dark:text-sage-200">
                    <Sparkles className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                    <span>AI Analysis Summary</span>
                  </div>
                  <p className="leading-relaxed">{product.aiReasoning}</p>
                </div>
              )}

              {/* Advantages and Trade-offs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {product.advantages?.length > 0 && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-taupe-200/80 dark:border-charcoal-700 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-800 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-sage-600" />
                      <span>Key Advantages</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-charcoal-600 dark:text-charcoal-300">
                      {product.advantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sage-600 font-bold">•</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.disadvantages?.length > 0 && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-taupe-200/80 dark:border-charcoal-700 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-800 dark:text-white flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-terracotta-100 dark:bg-charcoal-700 text-terracotta-600 dark:text-terracotta-300 font-bold text-[10px] flex items-center justify-center">
                        ✕
                      </span>
                      <span>Trade-offs to Keep in Mind</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-charcoal-600 dark:text-charcoal-300">
                      {product.disadvantages.map((dis, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-terracotta-500 font-bold">•</span>
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Full Technical Specifications Grid */}
              {product.specs && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                    Full Technical Specifications
                  </h3>
                  <div className="rounded-2xl border border-taupe-200/80 dark:border-charcoal-700 overflow-hidden divide-y divide-taupe-100 dark:divide-charcoal-700/50 bg-white dark:bg-charcoal-800 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex p-3 sm:p-3.5 hover:bg-ivory-50/50 dark:hover:bg-charcoal-700/30 transition-colors">
                        <span className="w-32 sm:w-44 uppercase font-semibold text-[10px] text-charcoal-400 shrink-0">
                          {key}
                        </span>
                        <span className="text-charcoal-800 dark:text-charcoal-200 font-medium leading-relaxed">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* IN-PRODUCT AGENTIC AI ASSISTANT PANEL */}
          {isAiDrawerOpen && (
            <aside className="w-full lg:w-[440px] xl:w-[480px] border-l border-taupe-200/80 dark:border-charcoal-800 bg-ivory-50/70 dark:bg-charcoal-900 flex flex-col h-full animate-slideLeft shrink-0 shadow-lg">
              {/* Drawer Header */}
              <div className="p-4 border-b border-taupe-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-800/90 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sage-600 text-white flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-charcoal-900 dark:text-white leading-none">
                      Product AI Assistant
                    </h2>
                    <span className="text-[10px] text-charcoal-400 truncate max-w-[220px] block mt-0.5">
                      Context: {product.name}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAiDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 hover:bg-taupe-100 dark:hover:bg-charcoal-700"
                  aria-label="Close assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${
                          isUser
                            ? 'bg-charcoal-800 text-white'
                            : 'bg-sage-600 text-white shadow-sm'
                        }`}
                      >
                        {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>

                      <div className={`space-y-2 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
                        {/* Conversational Text Bubble */}
                        <div
                          className={`p-3 rounded-2xl leading-relaxed ${
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

                        {/* Tool Call Execution Badge */}
                        {!isUser && msg.toolCall && (
                          <div className="p-2 rounded-xl bg-ivory-100 dark:bg-charcoal-800 border border-taupe-200/70 dark:border-charcoal-700 font-mono text-[10px] text-charcoal-600 dark:text-charcoal-300">
                            <span className="text-sage-700 dark:text-sage-400 font-bold">⚡ Tool: {msg.toolCall.tool}</span>
                          </div>
                        )}

                        {/* Agentic Product Cards Display (Interactive Inline Products) */}
                        {!isUser && msg.products && msg.products.length > 0 && (
                          <div className="space-y-2 pt-1">
                            {msg.products.map((p) => (
                              <div
                                key={p.id}
                                className="p-2.5 rounded-2xl bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 shadow-sm flex items-center gap-3 text-left hover:border-sage-400 transition-colors"
                              >
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-14 h-14 rounded-xl object-cover shrink-0 bg-ivory-100 dark:bg-charcoal-700"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] uppercase font-bold text-charcoal-400 truncate">
                                      {p.brand}
                                    </span>
                                    <span className="text-[10px] font-bold text-sage-700 dark:text-sage-400">
                                      {p.matchScore || 95}% Match
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-charcoal-900 dark:text-white truncate">
                                    {p.name}
                                  </h4>
                                  <div className="text-xs font-bold text-charcoal-900 dark:text-white mt-0.5">
                                    {formatCurrency(p.price)}
                                  </div>
                                </div>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => openProductModal(p)}
                                  icon={Eye}
                                  className="text-[10px] px-2.5 py-1.5 shrink-0 rounded-lg"
                                >
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <span className="text-[9px] text-charcoal-400 px-1 block">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* AI Thinking Indicator */}
                {isAiThinking && (
                  <div className="flex gap-2.5 items-center">
                    <div className="w-6 h-6 rounded-lg bg-sage-600 text-white shrink-0 flex items-center justify-center">
                      <Bot className="w-3 h-3 animate-spin" />
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 text-[11px] text-charcoal-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse" />
                      <span>Thinking & evaluating hardware data...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Context Starter Suggestions */}
              <div className="px-3 pt-2 pb-1 border-t border-taupe-200/60 dark:border-charcoal-800 bg-white/70 dark:bg-charcoal-800/70">
                <div className="flex flex-wrap gap-1">
                  {starterChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      disabled={isAiThinking}
                      onClick={() => handleSendChatMessage(chip)}
                      className="px-2 py-1 rounded-lg bg-ivory-100 dark:bg-charcoal-700/80 hover:bg-sage-50 hover:text-sage-700 dark:hover:bg-charcoal-700 dark:hover:text-sage-300 text-charcoal-700 dark:text-charcoal-300 border border-taupe-200/50 dark:border-charcoal-700 text-[10px] font-medium transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-taupe-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isAiThinking}
                    placeholder={`Ask why it's better, compare, or ask for alternatives...`}
                    className="flex-1 px-3 py-2 rounded-xl bg-ivory-50 dark:bg-charcoal-900 border border-taupe-200 dark:border-charcoal-700 text-xs text-charcoal-900 dark:text-white placeholder:text-charcoal-400 focus:outline-none focus:border-sage-500"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!chatInput.trim() || isAiThinking}
                    icon={Send}
                    className="text-xs p-2 shrink-0 rounded-xl"
                  >
                    Send
                  </Button>
                </form>
              </div>
            </aside>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ProductDetailsModal;
