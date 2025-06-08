
import { useState, useEffect } from "react";
import { ArrowLeft, Search, Send, Paperclip, Smile, MoreVertical, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { messageAPI } from "@/api/messages";
import { socketService } from "@/services/socketService";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/api/auth";

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = authAPI.getCurrentUser();

  useEffect(() => {
    loadConversations();
    setupSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadConversation();
    }
  }, [selectedConversation]);

  const setupSocket = () => {
    if (!socketService.getSocket()) {
      socketService.connect();
    }

    socketService.onNewMessage((message: any) => {
      // Update conversations list
      setConversations(prev => {
        const updated = [...prev];
        const conversationIndex = updated.findIndex(conv => 
          conv._id === message.conversationId
        );
        
        if (conversationIndex >= 0) {
          updated[conversationIndex].lastMessage = message;
          updated[conversationIndex].unreadCount = 
            message.recipient._id === currentUser?._id ? 
            (updated[conversationIndex].unreadCount || 0) + 1 : 0;
        }
        
        return updated;
      });

      // Update current conversation messages
      if (selectedConversation && 
          (message.conversationId === selectedConversation._id ||
           message.conversationId.includes(selectedConversation.lastMessage?.sender?._id) ||
           message.conversationId.includes(selectedConversation.lastMessage?.recipient?._id))) {
        setMessages(prev => {
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    });
  };

  const loadConversations = async () => {
    try {
      const response = await messageAPI.getConversationsList();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async () => {
    if (!selectedConversation) return;

    try {
      const otherUserId = selectedConversation.lastMessage.sender._id === currentUser?._id ?
        selectedConversation.lastMessage.recipient._id :
        selectedConversation.lastMessage.sender._id;

      const response = await messageAPI.getConversation(otherUserId);
      if (response.success) {
        setMessages(response.data);
        
        // Mark as read
        await messageAPI.markAsRead(selectedConversation._id);
        
        // Update conversation unread count
        setConversations(prev => 
          prev.map(conv => 
            conv._id === selectedConversation._id 
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !selectedConversation) return;

    setSending(true);
    try {
      const otherUserId = selectedConversation.lastMessage.sender._id === currentUser?._id ?
        selectedConversation.lastMessage.recipient._id :
        selectedConversation.lastMessage.sender._id;

      const response = await messageAPI.sendMessage({
        recipientId: otherUserId,
        content: newMessage.trim(),
        messageType: 'text'
      });

      if (response.success) {
        setNewMessage('');
        
        if (response.warning) {
          toast({
            title: "Content Filtered",
            description: response.warning,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conversation: any) => {
    return conversation.lastMessage.sender._id === currentUser?._id ?
      conversation.lastMessage.recipient :
      conversation.lastMessage.sender;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherUser(conv);
    const fullName = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg mb-3">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations found
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherUser = getOtherUser(conversation);
                    return (
                      <div
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedConversation?._id === conversation._id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={otherUser.profilePicture} />
                            <AvatarFallback>
                              {otherUser.firstName?.charAt(0)}{otherUser.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-sm truncate">
                                {otherUser.firstName} {otherUser.lastName}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage.content}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <Badge variant={otherUser.role === 'client' ? 'default' : 'secondary'} className="text-xs">
                                {otherUser.role}
                              </Badge>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getOtherUser(selectedConversation).profilePicture} />
                        <AvatarFallback>
                          {getOtherUser(selectedConversation).firstName?.charAt(0)}
                          {getOtherUser(selectedConversation).lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {getOtherUser(selectedConversation).firstName} {getOtherUser(selectedConversation).lastName}
                        </h3>
                        <Badge variant={getOtherUser(selectedConversation).role === 'client' ? 'default' : 'secondary'} className="text-xs">
                          {getOtherUser(selectedConversation).role}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content Policy Warning */}
                <Alert className="m-4 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please keep conversations professional. Sharing personal contact information, social media handles, or addresses is not allowed and will be filtered.
                  </AlertDescription>
                </Alert>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender._id === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender._id === currentUser?._id
                            ? 'bg-blue-500 text-white'
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
                        <p className={`text-xs mt-1 ${
                          message.sender._id === currentUser?._id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={sending}
                      />
                      <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={sendMessage} size="sm" disabled={!newMessage.trim() || sending}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
