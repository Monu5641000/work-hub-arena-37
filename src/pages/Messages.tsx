
import { useState } from "react";
import { ArrowLeft, Search, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      user: {
        name: "Rahul Kumar",
        avatar: "/placeholder.svg",
        isOnline: true
      },
      lastMessage: "Thank you for the amazing logo design!",
      timestamp: "2 min ago",
      unreadCount: 0,
      type: "client"
    },
    {
      id: 2,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        isOnline: false
      },
      lastMessage: "Can you make some revisions to the website?",
      timestamp: "1 hour ago",
      unreadCount: 2,
      type: "client"
    },
    {
      id: 3,
      user: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg",
        isOnline: true
      },
      lastMessage: "I can help you with your project requirements",
      timestamp: "3 hours ago",
      unreadCount: 0,
      type: "freelancer"
    }
  ];

  const messages = selectedConversation ? [
    {
      id: 1,
      sender: "other",
      content: "Hi! I'm interested in your logo design service.",
      timestamp: "10:30 AM",
      type: "text"
    },
    {
      id: 2,
      sender: "me",
      content: "Hello! I'd be happy to help you with your logo design. What kind of business do you have?",
      timestamp: "10:32 AM",
      type: "text"
    },
    {
      id: 3,
      sender: "other",
      content: "It's a tech startup focused on AI solutions. We need something modern and professional.",
      timestamp: "10:35 AM",
      type: "text"
    },
    {
      id: 4,
      sender: "me",
      content: "Perfect! I have experience with tech company branding. Let me show you some of my previous work.",
      timestamp: "10:37 AM",
      type: "text"
    },
    {
      id: 5,
      sender: "me",
      content: "portfolio-image.jpg",
      timestamp: "10:38 AM",
      type: "file"
    }
  ] : [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

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
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </div>
              <div className="overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {conversation.user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant={conversation.type === 'client' ? 'default' : 'secondary'} className="text-xs">
                            {conversation.type}
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
                ))}
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
                      <div className="relative">
                        <img 
                          src={selectedConversation.user.avatar}
                          alt={selectedConversation.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {selectedConversation.user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedConversation.user.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.user.isOnline ? 'Online' : 'Last seen 2 hours ago'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'me'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.type === 'file' ? (
                          <div className="flex items-center space-x-2">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm">{message.content}</span>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
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
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Please keep the conversation professional. Sharing contact information is not allowed.
                  </p>
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
