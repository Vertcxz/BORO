import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room } from '../types';
import { Search, Users, CheckCircle, X, Filter, Plus, Edit, Trash2, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoomList = () => {
  const { user, rooms, categories, facilities, addBooking, addRoom, updateRoom, deleteRoom } = useApp();
  const navigate = useNavigate();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Booking Modal State
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  // Admin Room Modal State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState<Partial<Room>>({
    name: '', capacity: 0, type: '', facilities: [], imageUrl: ''
  });

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || room.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoom) {
      addBooking({
        roomId: selectedRoom.id,
        date,
        startTime,
        endTime,
        purpose,
        isEmergency: false
      });
      setSelectedRoom(null); // Close modal
      navigate('/history');
    }
  };

  // --- ADMIN HANDLERS ---
  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomForm(room);
    setIsRoomModalOpen(true);
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteRoom(id);
    }
  };

  const handleAddRoomClick = () => {
    setEditingRoom(null);
    setRoomForm({ 
        name: '', 
        capacity: 20, 
        type: categories[0]?.id || '', 
        facilities: [], 
        imageUrl: `https://picsum.photos/800/600?random=${Date.now()}` 
    });
    setIsRoomModalOpen(true);
  };

  const handleRoomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.name || !roomForm.type) return;

    if (editingRoom) {
        updateRoom({ ...roomForm as Room, id: editingRoom.id });
    } else {
        const newRoom: Room = {
            ...roomForm as Room,
            id: `R${Date.now()}`.slice(0, 6), // Simple ID gen
        };
        addRoom(newRoom);
    }
    setIsRoomModalOpen(false);
  };

  const toggleFacility = (facility: string) => {
    setRoomForm(prev => {
        const current = prev.facilities || [];
        if (current.includes(facility)) {
            return { ...prev, facilities: current.filter(f => f !== facility) };
        } else {
            return { ...prev, facilities: [...current, facility] };
        }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user?.role === 'admin' ? 'Manage Rooms' : 'Book a Room'}
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'admin' 
              ? 'Add, edit, or remove rooms from the system'
              : 'Select a category to find the perfect space'
            }
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={handleAddRoomClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
            >
              <Plus size={18} /> Add Room
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
        >
            All Rooms
        </button>
        {categories.map(cat => (
            <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === cat.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                {selectedCategory === cat.id && <CheckCircle size={14} />}
                {cat.name}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 overflow-hidden bg-gray-100 relative group">
              <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 capitalize shadow-sm">
                {categories.find(c => c.id === room.type)?.name || room.type}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                <span className="text-xs text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded">{room.id}</span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Users size={16} className="mr-1.5" />
                <span>Capacity: {room.capacity} people</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {room.facilities.slice(0, 3).map(fac => (
                  <span key={fac} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                    {fac}
                  </span>
                ))}
                {room.facilities.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">+{room.facilities.length - 3}</span>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                {user?.role === 'admin' ? (
                  <>
                    <button 
                      onClick={() => handleEditRoom(room)}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteRoom(room.id)}
                      className="py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setSelectedRoom(room)}
                    className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Book This Room
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Filter size={48} className="mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700">No rooms found</h3>
            <p className="mb-4">Try changing your category or search terms.</p>
            <button 
                onClick={() => {setSelectedCategory('all'); setSearchQuery('')}}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
                View All Rooms
            </button>
          </div>
        )}
      </div>

      {/* Student/Lecturer Booking Modal */}
      {selectedRoom && user?.role !== 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Booking {selectedRoom.name}</h3>
              <button onClick={() => setSelectedRoom(null)} className="hover:bg-indigo-500 p-1 rounded transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800 flex justify-between">
                <span><strong>Type:</strong> {categories.find(c => c.id === selectedRoom.type)?.name}</span>
                <span><strong>Capacity:</strong> {selectedRoom.capacity}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    required 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input 
                    type="time" 
                    required 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g., Physics Midterm Exam"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2">
                  <CheckCircle size={20} />
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Room Management Modal */}
      {isRoomModalOpen && user?.role === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-indigo-900 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold text-lg">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setIsRoomModalOpen(false)} className="hover:bg-indigo-700 p-1 rounded transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRoomFormSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                    <input 
                        type="text" required 
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={roomForm.name}
                        onChange={e => setRoomForm({...roomForm, name: e.target.value})}
                        placeholder="e.g. Lecture Hall B"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input 
                        type="number" required min="1"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={roomForm.capacity}
                        onChange={e => setRoomForm({...roomForm, capacity: parseInt(e.target.value) || 0})}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={roomForm.type}
                        onChange={e => setRoomForm({...roomForm, type: e.target.value})}
                    >
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                     <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={roomForm.imageUrl}
                            onChange={e => setRoomForm({...roomForm, imageUrl: e.target.value})}
                            placeholder="https://..."
                        />
                        <button 
                            type="button"
                            onClick={() => setRoomForm({...roomForm, imageUrl: `https://picsum.photos/800/600?random=${Date.now()}`})}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                            title="Generate Random Image"
                        >
                            <Image size={20} />
                        </button>
                     </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                    {facilities.map(fac => (
                        <label key={fac} className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input 
                                type="checkbox"
                                checked={roomForm.facilities?.includes(fac)}
                                onChange={() => toggleFacility(fac)}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{fac}</span>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Manage available facilities in the Admin Panel.</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button type="submit" className="w-full bg-indigo-900 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors">
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};