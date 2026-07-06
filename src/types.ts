export interface Student {
  name: string;
  registerNumber: string;
  department: string;
  year: string;
  hostelBlock: string;
  roomNumber: string;
  email: string;
  password?: string; // Stored securely/hashed or simple string for demo
}

export interface Warden {
  name: string;
  wardenId: string;
  hostelBlock: string;
  email: string;
  password?: string;
}

export interface Complaint {
  id: string; // Generated on creation
  studentName: string;
  registerNumber: string;
  hostelBlock: string;
  complaintType: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
  studentEmail: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
