import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Siren, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmergencyBooking = () => {
  const { user, rooms, addBooking } = useApp();
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default today
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');

  if (!user || user.role !== 'dosen') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-400">Access Denied</h2>
        <p className="text-gray-500">Only Lecturers can access emergency bookings.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && reason) {
      addBooking({
        roomId,
        date,
        startTime,
        endTime,
        purpose: `[EMERGENCY] ${reason}`,
        isEmergency: true
      });
      navigate('/history');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-start space-x-4">
        <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
          <Siren size={32} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-red-800">Emergency Booking System</h1>
          <p className="text-red-700 mt-1 text-sm">
            Emergency bookings bypass standard approval queues. Use this only for urgent class replacements, immediate meetings, or facility issues. Misuse may result in account suspension.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-700">Submit Urgent Request</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Room (Override Mode)</label>
            <select 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            >
              <option value="">-- Select a Room --</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.id} - {r.name} ({r.capacity} pax)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input 
                type="time" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input 
                type="time" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Emergency</label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-3 text-red-400" size={18} />
              <textarea 
                required
                rows={3}
                placeholder="Explain the urgency..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
          >
            <Siren size={20} />
            Confirm Emergency Booking
          </button>
        </form>
      </div>
    </div>
  );
};