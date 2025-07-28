import { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, type Message } from './ChatMessage';
import { FloatingInput } from './FloatingInput';
import { DropOverlay } from './DropOverlay';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ChatContainerProps {
  className?: string;
}

// Mock sample data
const sampleMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I\'m your secure government AI assistant. How can I help you today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: '2',
    content: 'Can you help me understand the process for submitting a FOIA request?',
    sender: 'user',
    timestamp: new Date(Date.now() - 8000),
  },
  {
    id: '3',
    content: `Certainly! Here's how to submit a **Freedom of Information Act (FOIA)** request:

## Steps to Submit a FOIA Request:

1. **Identify the correct agency** - Determine which federal agency has the records you're seeking
2. **Write a clear request** - Be as specific as possible about what records you want
3. **Submit your request** - Send it to the agency's FOIA office

### Required Information:
- Your name and contact information
- Clear description of the records you're seeking
- Date range (if applicable)
- Format preference (digital, paper, etc.)

### Processing Time:
- Standard processing: **20 business days**
- Complex requests may take longer
- You can request expedited processing in urgent situations

Would you like me to help you draft a specific FOIA request or provide more details about any particular aspect?`,
    sender: 'ai',
    timestamp: new Date(Date.now() - 5000),
  },
];

export function ChatContainer({ className }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Check if should show scroll to bottom button
  const checkScrollPosition = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [checkScrollPosition]);

  // Simulate AI response
  const simulateAIResponse = useCallback((userMessage: string) => {
    setIsLoading(true);
    
    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true,
    };
    
    setMessages(prev => [...prev, typingMessage]);

    // Simulate response delay
    setTimeout(() => {
      const responses = [
        `Thank you for your question about "${userMessage.slice(0, 50)}...". I'm here to assist you with government-related inquiries and provide accurate, helpful information.`,
        `I understand you're asking about "${userMessage.slice(0, 30)}...". Let me provide you with some relevant information and guidance on this topic.`,
        `That's a great question regarding "${userMessage.slice(0, 40)}...". Here's what I can tell you based on current government policies and procedures.`,
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(aiResponse));
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  }, []);

  const handleSendMessage = useCallback((content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Handle file uploads
    if (files && files.length > 0) {
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully. Processing...`,
      });
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content || `Uploaded ${files?.length} file(s)`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    simulateAIResponse(content);
  }, [simulateAIResponse, toast]);

  // Drag and drop functionality
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleSendMessage('', acceptedFiles);
    }
  }, [handleSendMessage]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'text/*': ['.txt', '.md'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className={cn("flex flex-col h-screen relative", className)} {...getRootProps()}>
      <input {...getInputProps()} />
      
      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-chat-bg px-4 md:px-8 py-6 space-y-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-24 right-8 z-20"
          >
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-floating"
              onClick={scrollToBottom}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Input */}
      <div className="relative">
        <FloatingInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Drop Overlay */}
      <DropOverlay isVisible={isDragActive} isDragActive={isDragAccept} />
    </div>
  );
}