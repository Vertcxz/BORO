export type Role = 'admin' | 'dosen' | 'mahasiswa';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  type: string; // Now refers to Category.id
  imageUrl: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  isEmergency: boolean;
  createdAt: number;
}

// Initial Data
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'classroom', name: 'Classrooms' },
  { id: 'lab', name: 'Laboratories' },
  { id: 'auditorium', name: 'Halls & Auditoriums' },
  { id: 'meeting', name: 'Meeting Rooms' },
];

export const INITIAL_FACILITIES: string[] = [
  'Projector', 'Sound System', 'AC', 'Whiteboard', 
  'Smartboard', 'PCs', 'High-speed Internet', 'Lab Equipment',
  'Conference Phone', 'TV Screen', 'Coffee Machine'
];

export const MOCK_ROOMS: Room[] = [
  {
    id: 'R101',
    name: 'Lecture Hall A',
    capacity: 100,
    facilities: ['Projector', 'Sound System', 'AC', 'Whiteboard'],
    type: 'auditorium',
    imageUrl: 'https://picsum.photos/800/600?random=1'
  },
  {
    id: 'R102',
    name: 'Computer Lab 1',
    capacity: 40,
    facilities: ['PCs', 'High-speed Internet', 'AC', 'Smartboard'],
    type: 'lab',
    imageUrl: 'https://picsum.photos/800/600?random=2'
  },
  {
    id: 'R103',
    name: 'Seminar Room B',
    capacity: 30,
    facilities: ['Projector', 'AC'],
    type: 'classroom',
    imageUrl: 'https://picsum.photos/800/600?random=3'
  },
  {
    id: 'R201',
    name: 'Faculty Meeting Room',
    capacity: 15,
    facilities: ['TV Screen', 'Conference Phone', 'AC', 'Coffee Machine'],
    type: 'meeting',
    imageUrl: 'https://picsum.photos/800/600?random=4'
  },
  {
    id: 'R202',
    name: 'Physics Lab',
    capacity: 25,
    facilities: ['Lab Equipment', 'AC', 'Whiteboard'],
    type: 'lab',
    imageUrl: 'https://picsum.photos/800/600?random=5'
  }
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Dr. Budi Santoso', email: 'dosen@uni.ac.id', role: 'dosen' },
  { id: 'u2', name: 'Admin Staff', email: 'admin@uni.ac.id', role: 'admin' },
  { id: 'u3', name: 'Siti Aminah', email: 'mahasiswa@uni.ac.id', role: 'mahasiswa' },
];