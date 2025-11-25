import React from 'react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { Clock, Calendar, AlertCircle, Check, X } from 'lucide-react';

export const History = () => {
  const { user, bookings, rooms, cancelBooking, approveBooking } = useApp();

  if (!user) return null;

  // Admins see all, others see their own
  const displayedBookings = user.role === 'admin' 
    ? bookings 
    : bookings.filter(b => b.userId === user.id);
  
  // Sort by date desc
  displayedBookings.sort((a, b) => b.createdAt - a.createdAt);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Booking History</h1>
      
      {displayedBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map(booking => {
            const roomName = rooms.find(r => r.id === booking.roomId)?.name || booking.roomId;
            
            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-4 justify-between transition-all hover:border-indigo-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{roomName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)} uppercase tracking-wide`}>
                      {booking.status}
                    </span>
                    {booking.isEmergency && (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        <AlertCircle size={12} /> Emergency
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{booking.purpose}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {format(new Date(booking.date), 'MMMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {booking.startTime} - {booking.endTime}
                    </div>
                    {user.role === 'admin' && (
                       <div className="flex items-center gap-1 text-indigo-600">
                       <span className="font-semibold">By:</span> {booking.userName}
                     </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                  {booking.status === 'pending' && user.role === 'admin' && (
                    <button 
                      onClick={() => approveBooking(booking.id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
                    >
                      <Check size={16} /> Approve
                    </button>
                  )}
                  
                  {(booking.status === 'pending' || user.role === 'admin') && (
                    <button 
                      onClick={() => cancelBooking(booking.id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-1"
                    >
                      <X size={16} /> {user.role === 'admin' ? 'Reject' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};