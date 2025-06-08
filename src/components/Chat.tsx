
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { messageAPI } from '@/api/messages';
import { socketService } from '@/services/socketService';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/api/auth';

interface ChatProps {
  recipientId: string;
  recipientName: string;
  onClose?: () => void;
}

const Chat: React.FC<ChatProps> = ({ recipientId, recipientName, onClose }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  const currentUser = authAPI.getCurrentUser();
  const conversationId = [currentUser?._id, recipientId].sort().join('_');

  useEffect(() => {
    loadConversation();
    setupSocket();
    
    return () => {
      socketService.leaveRoom(`chat_${recipientId}`);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    try {
      const response = await messageAPI.getConversation(recipientId);
      if (response.success) {
        setMessages(response.data);
        // Mark messages as read
        await messageAPI.markAsRead(conversationId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    if (!socketService.getSocket()) {
      socketService.connect();
    }
    
    socketService.joinRoom(`chat_${recipientId}`);
    
    // Listen for new messages
    const unsubscribe = socketService.onNewMessage((message: any) => {
      if (
        (message.sender._id === recipientId && message.recipient._id === currentUser?._id) ||
        (message.sender._id === currentUser?._id && message.recipient._id === recipientId)
      ) {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    });

    // Listen for typing indicators
    socketService.onUserTyping((data: any) => {
      if (data.userId === recipientId) {
        setUserTyping(data.userName);
      }
    });

    socketService.onUserStoppedTyping((data: any) => {
      if (data.userId === recipientId) {
        setUserTyping(null);
      }
    });

    return unsubscribe;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketService.startTyping(recipientId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.stopTyping(recipientId);
    }, 1000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const messageData = {
        recipientId,
        content: newMessage.trim(),
        messageType: 'text' as const
      };

      const response = await messageAPI.sendMessage(messageData);
      if (response.success) {
        setNewMessage('');
        
        if (response.warning) {
          toast({
            title: "Content Filtered",
            description: response.warning,
            variant: "destructive",
          });
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
      if (isTyping) {
        setIsTyping(false);
        socketService.stopTyping(recipientId);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    handleTyping();
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading conversation...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Chat with {recipientName}</CardTitle>
            {userTyping && (
              <p className="text-sm text-gray-500">{userTyping} is typing...</p>
            )}
          </div>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Content Policy Warning */}
        <Alert className="m-4 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please keep conversations professional. Sharing personal contact information, social media handles, or addresses is not allowed and will be filtered.
          </AlertDescription>
        </Alert>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender._id === currentUser?._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender._id === currentUser?._id
                      ? 'bg-blue-600 text-white'
                      : message.sender.role === 'admin'
                      ? 'bg-red-100 text-red-900 border border-red-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.sender.role === 'admin' && (
                    <Badge variant="destructive" className="mb-1 text-xs">
                      Admin Message
                    </Badge>
                  )}
                  <p className="text-sm">{message.content}</p>
                  {message.isFiltered && (
                    <p className="text-xs mt-1 opacity-70 italic">
                      Content was filtered
                    </p>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={sending}
            />
            <Button variant="outline" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || sending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
