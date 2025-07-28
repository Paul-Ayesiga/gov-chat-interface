import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatContainer } from '@/components/ChatContainer';

const Index = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar />
      <ChatContainer className="flex-1" />
    </div>
  );
};

export default Index;
