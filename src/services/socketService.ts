
import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private messageCallbacks: ((message: any) => void)[] = [];
  private connected: boolean = false;

  connect() {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      console.warn('No token found, cannot connect to socket');
      return;
    }

    if (this.socket && this.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    try {
      this.socket = io('http://localhost:5000', {
        auth: {
          token: this.token
        },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.connected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.connected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.connected = false;
      });

      this.socket.on('newMessage', (message) => {
        console.log('New message received:', message);
        this.messageCallbacks.forEach(callback => {
          try {
            callback(message);
          } catch (error) {
            console.error('Error in message callback:', error);
          }
        });
      });

      return this.socket;
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
    this.messageCallbacks = [];
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }

  joinRoom(roomId: string) {
    if (this.socket && this.connected) {
      this.socket.emit('join_room', roomId);
    } else {
      console.warn('Socket not connected, cannot join room');
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket && this.connected) {
      this.socket.emit('leave_room', roomId);
    } else {
      console.warn('Socket not connected, cannot leave room');
    }
  }

  sendMessage(messageData: any) {
    if (this.socket && this.connected) {
      this.socket.emit('send_message', messageData);
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  }

  onNewMessage(callback: (message: any) => void) {
    this.messageCallbacks.push(callback);
    
    // Clean up function
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  onProposalUpdate(callback: (proposal: any) => void) {
    if (this.socket) {
      this.socket.on('proposal_updated', callback);
    }
  }

  // Typing indicators
  startTyping(recipientId: string) {
    if (this.socket && this.connected) {
      this.socket.emit('typing_start', { recipientId });
    }
  }

  stopTyping(recipientId: string) {
    if (this.socket && this.connected) {
      this.socket.emit('typing_stop', { recipientId });
    }
  }

  onUserTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_stopped_typing', callback);
    }
  }
}

export const socketService = new SocketService();
