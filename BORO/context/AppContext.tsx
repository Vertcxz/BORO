import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Room, Booking, Category, INITIAL_USERS, MOCK_ROOMS, INITIAL_CATEGORIES, INITIAL_FACILITIES, Role } from '../types';

interface AppContextType {
  user: User | null;
  login: (email: string, role: Role) => boolean;
  logout: () => void;
  
  // Data State
  rooms: Room[];
  bookings: Booking[];
  users: User[];
  categories: Category[];
  facilities: string[];

  // Booking Actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'userName' | 'status'>) => void;
  cancelBooking: (id: string) => void;
  approveBooking: (id: string) => void;

  // CRUD Actions
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;

  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  addFacility: (name: string) => void;
  deleteFacility: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  // --- STATE INITIALIZATION ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unispace_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('unispace_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('unispace_rooms');
    return saved ? JSON.parse(saved) : MOCK_ROOMS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('unispace_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('unispace_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [facilities, setFacilities] = useState<string[]>(() => {
    const saved = localStorage.getItem('unispace_facilities');
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    if (user) localStorage.setItem('unispace_user', JSON.stringify(user));
    else localStorage.removeItem('unispace_user');
  }, [user]);

  useEffect(() => localStorage.setItem('unispace_bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem('unispace_rooms', JSON.stringify(rooms)), [rooms]);
  useEffect(() => localStorage.setItem('unispace_users_list', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('unispace_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('unispace_facilities', JSON.stringify(facilities)), [facilities]);

  // --- AUTH ---
  const login = (email: string, role: Role) => {
    let foundUser = users.find(u => u.email === email);
    if (!foundUser) {
        // If not found in our managed list, allow ephemeral login for demo, or reject.
        // For this demo, let's create a temp session user if it's a new email
        foundUser = {
            id: `user-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role
        };
        // Ideally we should add them to 'users' state too, but let's keep 'users' state for the admin managed list
        // and 'user' state for the current session.
    } else {
        // Update role if changed in login (for demo flexibility)
        foundUser = { ...foundUser, role }; 
    }
    setUser(foundUser);
    return true;
  };

  const logout = () => setUser(null);

  // --- BOOKING ACTIONS ---
  const addBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'userName' | 'status'>) => {
    if (!user) return;
    const newBooking: Booking = {
      ...newBookingData,
      id: `bk-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      status: newBookingData.isEmergency ? 'approved' : 'pending',
      createdAt: Date.now(),
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const cancelBooking = (id: string) => setBookings(prev => prev.filter(b => b.id !== id));
  const approveBooking = (id: string) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));

  // --- CRUD ACTIONS ---
  // Rooms
  const addRoom = (room: Room) => setRooms(prev => [...prev, room]);
  const updateRoom = (room: Room) => setRooms(prev => prev.map(r => r.id === room.id ? room : r));
  const deleteRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));

  // Users
  const addUser = (u: User) => setUsers(prev => [...prev, u]);
  const updateUser = (u: User) => setUsers(prev => prev.map(user => user.id === u.id ? u : user));
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  // Categories
  const addCategory = (c: Category) => setCategories(prev => [...prev, c]);
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  // Facilities
  const addFacility = (name: string) => {
    if (!facilities.includes(name)) setFacilities(prev => [...prev, name]);
  };
  const deleteFacility = (name: string) => setFacilities(prev => prev.filter(f => f !== name));

  return (
    <AppContext.Provider value={{
      user, login, logout,
      rooms, bookings, users, categories, facilities,
      addBooking, cancelBooking, approveBooking,
      addRoom, updateRoom, deleteRoom,
      addUser, updateUser, deleteUser,
      addCategory, deleteCategory,
      addFacility, deleteFacility
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};