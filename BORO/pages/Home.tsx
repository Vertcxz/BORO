import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, CalendarCheck, AlertTriangle, LayoutGrid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { user, bookings, rooms } = useApp();

  if (!user) return null;

  // Filter bookings based on role
  const myBookings = user.role === 'admin' 
    ? bookings 
    : bookings.filter(b => b.userId === user.id);

  const upcomingBookings = myBookings.filter(b => {
    const bookingTime = new Date(`${b.date}T${b.endTime}`).getTime();
    return bookingTime > Date.now();
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pendingCount = myBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Hello, {user.name} 👋</h1>
        <p className="text-gray-600 mt-2">Here is what's happening on campus today.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Upcoming Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Approval</p>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>

        {user.role === 'dosen' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Emergency Access</p>
              <p className="text-sm font-bold text-red-600">Available</p>
            </div>
          </div>
        )}
      </div>

      {/* Next Up Section - Only for Non-Admins */}
      {user.role !== 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Next Scheduled Booking</h2>
              <Link to="/history" className="text-sm text-indigo-600 hover:underline">View All</Link>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-indigo-900 text-lg">
                      {rooms.find(r => r.id === upcomingBookings[0].roomId)?.name || upcomingBookings[0].roomId}
                    </h3>
                    <p className="text-indigo-700 mt-1">{upcomingBookings[0].purpose}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                     upcomingBookings[0].status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {upcomingBookings[0].status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-sm text-indigo-800 space-x-4">
                  <span className="flex items-center gap-1">
                    <CalendarCheck size={16} />
                    {upcomingBookings[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {upcomingBookings[0].startTime} - {upcomingBookings[0].endTime}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                No upcoming bookings scheduled.
                <div className="mt-4">
                   <Link to="/rooms" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Book Now</Link>
                </div>
              </div>
            )}
          </section>

          <section className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-2">Explore Facilities</h2>
                  <p className="text-indigo-100 mb-6 max-w-sm">
                    Find the perfect space for your needs. We have separated rooms into categories like Labs, Auditoriums, and Meeting Rooms for easier access.
                  </p>
                  <Link to="/rooms" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                      Browse Categories <ArrowRight size={18} />
                  </Link>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10">
                  <LayoutGrid size={180} />
              </div>
          </section>
        </div>
      )}
    </div>
  );
};