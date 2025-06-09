
import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private messageCallbacks: ((message: any) => void)[] = [];

  connect() {
    this.token = localStorage.getItem('token');
    if (!this.token) return;

    this.socket = io('http://localhost:5000', {
      auth: {
        token: this.token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('newMessage', (message) => {
      console.log('New message received:', message);
      this.messageCallbacks.forEach(callback => callback(message));
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.messageCallbacks = [];
  }

  getSocket() {
    return this.socket;
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave_room', roomId);
    }
  }

  sendMessage(messageData: any) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
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
    if (this.socket) {
      this.socket.emit('typing_start', { recipientId });
    }
  }

  stopTyping(recipientId: string) {
    if (this.socket) {
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
