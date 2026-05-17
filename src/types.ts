export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'admin' | 'user';
  isPremium: boolean;
  isBanned: boolean;
  status: 'online' | 'offline';
}

export interface ServiceRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  type: 'general' | 'meet';
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  replyMessage?: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  senderName?: string;
  isSystem?: boolean;
}
