import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  History, 
  Settings, 
  MessageSquare, 
  Trash2, 
  Download,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  className?: string;
}

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  }
};

export function ChatSidebar({ className }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const navigationItems = [
    { icon: MessageSquare, label: 'New Chat', action: () => {} },
    { icon: History, label: 'Chat History', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
  ];

  const utilityItems = [
    { icon: Download, label: 'Export Chat', action: () => {} },
    { icon: Trash2, label: 'Clear All', action: () => {} },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-nav text-primary-foreground">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">GovChat AI</h1>
            <p className="text-sm opacity-80">Secure Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider opacity-60 mb-3">
            Navigation
          </h3>
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-3 text-primary-foreground hover:bg-white/10 hover:text-white"
                onClick={() => {
                  item.action();
                  closeMobileSidebar();
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider opacity-60 mb-3">
            Actions
          </h3>
          <div className="space-y-1">
            {utilityItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-3 text-primary-foreground hover:bg-white/10 hover:text-white"
                onClick={() => {
                  item.action();
                  closeMobileSidebar();
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs opacity-60">
          <Bot className="w-4 h-4" />
          <span>Secure • Encrypted • Compliant</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card shadow-elegant"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-0 h-full z-40 shadow-elegant",
          isOpen ? "w-64" : "w-0",
          className
        )}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-64 h-full"
            >
              <SidebarContent />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Desktop Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "hidden md:flex fixed top-4 z-50 bg-card shadow-elegant transition-all duration-300",
          isOpen ? "left-60" : "left-4"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed left-0 top-0 h-full w-64 z-50 md:hidden shadow-elegant"
            >
              <SidebarContent />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-primary-foreground hover:bg-white/10"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for desktop */}
      <div className={cn(
        "hidden md:block transition-all duration-300",
        isOpen ? "w-64" : "w-0"
      )} />
    </>
  );
}