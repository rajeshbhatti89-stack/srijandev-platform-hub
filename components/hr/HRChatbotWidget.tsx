'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RefreshCw, 
  LifeBuoy, 
  ShieldAlert, 
  ChevronDown, 
  Maximize2, 
  Minimize2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useHRStore } from '@/store/useHRStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
  requiresTicket?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `Hello! 👋 I am your **SrijanDev HR & Policy Assistant** (Powered by Gemini).

I can answer questions regarding our official company policies, leave entitlements, medical insurance, WFH guidelines, and internal procedures.

*Note: For specific personal salary figures, tax deductions, or sensitive data, I will guide you to our Human HR Helpdesk.*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTED_QUESTIONS = [
  'What is our Casual & Sick leave entitlement?',
  'How do I claim cashless Medical Insurance?',
  'What is the Hybrid / WFH policy?',
  'Where can I find my monthly payslips?',
  'How much is the annual L&D training budget?',
];

export default function HRChatbotWidget() {
  const { theme, setActiveTab, createTicket, currentUserRole, employees } = useHRStore();
  const isLight = theme === 'light';

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ticketCreatedNotice, setTicketCreatedNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const replyText = data.reply || 'I am currently unable to answer this question. Please contact HR Helpdesk.';
      
      const isSensitivePayrollQuery = 
        query.toLowerCase().includes('salary') || 
        query.toLowerCase().includes('payroll') || 
        query.toLowerCase().includes('tax') || 
        query.toLowerCase().includes('deduction');

      const assistantMessage: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        requiresTicket: isSensitivePayrollQuery,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMessage: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: 'I could not reach the server right now. For urgent assistance, please raise a ticket in the **Helpdesk** module or reach out directly to your HR partner.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        requiresTicket: true,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHRTicket = (inquiryTopic: string) => {
    const emp = employees[0] || { id: 'SRJ-001', name: 'Employee', department: 'Engineering' };
    createTicket({
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      category: 'Payroll & Tax',
      priority: 'High',
      subject: `HR Assistant Query: ${inquiryTopic.slice(0, 40)}...`,
      description: `Inquiry submitted via Gemini HR Assistant: "${inquiryTopic}". Transferred for confidential human HR support and verification.`,
      status: 'Open',
      assignedTo: 'Neha Verma (HR Operations)',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      slaDeadline: '24 Hours',
      comments: [
        {
          id: `c-${Date.now()}`,
          authorName: 'Gemini Assistant',
          authorRole: 'AI Policy Agent',
          message: 'Confidential request routed from employee chat session for human HR review.',
          timestamp: 'Just now',
          isStaff: true,
        },
      ],
    });

    setTicketCreatedNotice(true);
    setTimeout(() => setTicketCreatedNotice(false), 3500);
    setActiveTab('helpdesk');
    setIsOpen(false);
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open HR Support Assistant"
              className="group relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white font-bold text-sm shadow-[0_8px_30px_rgba(245,158,11,0.35)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <Bot className="w-5 h-5 text-gray-950" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-gray-950 animate-pulse" />
              </div>
              <span className="font-extrabold tracking-wide text-gray-950">Ask HR AI</span>
              <span className="hidden sm:inline-block text-[11px] font-semibold bg-black/20 text-gray-900 px-2 py-0.5 rounded-full">
                Gemini
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Drawer / Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className={`fixed z-50 flex flex-col shadow-2xl transition-all duration-200 ${
              isExpanded
                ? 'inset-4 sm:inset-10 rounded-3xl'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[85vh] rounded-3xl'
            } ${
              isLight
                ? 'bg-white/95 border border-slate-200/90 text-slate-900 backdrop-blur-xl shadow-slate-400/20'
                : 'bg-gray-950/95 border border-amber-500/25 text-slate-100 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)]'
            }`}
          >
            {/* Chat Header */}
            <div
              className={`p-4 sm:px-5 flex items-center justify-between border-b rounded-t-3xl transition-colors ${
                isLight
                  ? 'bg-slate-50/90 border-slate-200'
                  : 'bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
                  <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-gray-950'}`}>
                    <Bot className={`w-5 h-5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold tracking-tight">SrijanDev HR Assistant</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/25">
                      Gemini AI
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      Policy & Operations Guide
                    </span>
                  </div>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  title="Clear conversation"
                  className={`p-1.5 rounded-lg transition-colors ${
                    isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <RefreshCw size={15} />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Minimize size' : 'Expand window'}
                  className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                    isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className={`p-1.5 rounded-lg transition-colors ${
                    isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Policy & Privacy Banner */}
            <div
              className={`px-4 py-2 text-[11px] flex items-center gap-2 border-b font-medium ${
                isLight
                  ? 'bg-amber-50 border-amber-100 text-amber-800'
                  : 'bg-amber-500/5 border-amber-500/10 text-amber-400/90'
              }`}
            >
              <ShieldAlert size={14} className="shrink-0" />
              <span>Strict privacy locked: Personal salary/tax figures require a verified HR ticket.</span>
            </div>

            {/* Ticket Created Notification */}
            {ticketCreatedNotice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500 text-gray-950 px-4 py-2 text-xs font-bold flex items-center justify-between"
              >
                <span>✅ Ticket successfully created in Helpdesk module! Redirecting...</span>
              </motion.div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-medium rounded-br-sm'
                        : isLight
                        ? 'bg-slate-100 border border-slate-200/80 text-slate-800 rounded-bl-sm'
                        : 'bg-white/[0.06] border border-white/10 text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Submit Ticket Action Card if confidential question */}
                    {msg.requiresTicket && (
                      <div className={`mt-3 pt-3 border-t flex flex-col gap-2 ${isLight ? 'border-slate-300' : 'border-white/10'}`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                          <LifeBuoy size={14} /> Need official verification?
                        </div>
                        <button
                          onClick={() => handleCreateHRTicket(messages[messages.length - 2]?.content || 'Payroll question')}
                          className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md"
                        >
                          <LifeBuoy size={14} />
                          Open Confidential HR Ticket
                        </button>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 px-1 ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                    {msg.timestamp} {msg.source ? `• ${msg.source}` : ''}
                  </span>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-amber-500 font-medium p-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Gemini is checking company policy guidelines...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            {messages.length <= 2 && (
              <div className={`p-3 border-t border-b text-xs ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Suggested Policy Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors text-left ${
                        isLight
                          ? 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className={`p-3 sm:p-4 border-t rounded-b-3xl ${isLight ? 'bg-white border-slate-200' : 'bg-gray-950 border-white/10'}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about HR, leaves, benefits..."
                  maxLength={1000}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                    isLight
                      ? 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
                      : 'bg-white/5 border border-white/10 text-white placeholder-gray-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-500/20 active:scale-95 flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
