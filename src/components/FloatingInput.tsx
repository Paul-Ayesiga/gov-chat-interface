import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FloatingInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  className?: string;
}

export function FloatingInput({ onSendMessage, isLoading = false, className }: FloatingInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() || attachedFiles.length > 0) {
      onSendMessage(message.trim(), attachedFiles);
      setMessage('');
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed bottom-6 w-full px-4 z-30",
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-chat-input-bg border border-border rounded-2xl shadow-floating p-4">
        {/* File attachments */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 space-y-2"
            >
              {attachedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 bg-muted rounded-lg p-2"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="flex items-end gap-3">
          {/* File upload button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Message input */}
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              className="min-h-[40px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Send button */}
          <Button
            onClick={handleSubmit}
            disabled={(!message.trim() && attachedFiles.length === 0) || isLoading}
            className="h-10 w-10 rounded-full bg-gov-blue hover:bg-gov-blue/90 text-white"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
        />

        {/* Character count */}
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>
            {attachedFiles.length > 0 && `${attachedFiles.length} file(s) attached • `}
            Pro tip: Use Shift+Enter for new lines
          </span>
          <span className={cn(
            message.length > 2000 && "text-destructive"
          )}>
            {message.length}/2000
          </span>
        </div>
        </div>
      </div>
    </motion.div>
  );
}