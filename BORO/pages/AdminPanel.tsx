import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Category, Role } from '../types';
import { Trash2, Edit, Plus, User as UserIcon, Tag, Settings, Save, X } from 'lucide-react';

export const AdminPanel = () => {
  const { 
    users, categories, facilities,
    addUser, updateUser, deleteUser,
    addCategory, deleteCategory,
    addFacility, deleteFacility
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'facilities'>('users');

  // User State
  const [editingUser, setEditingUser] = useState<Partial<User>>({});
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Category State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');

  // Facility State
  const [newFacilityName, setNewFacilityName] = useState('');

  // --- USER HANDLERS ---
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser({ role: 'mahasiswa', name: '', email: '' });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser.id) {
        updateUser(editingUser as User);
    } else {
        const newUser: User = {
            ...editingUser as User,
            id: `u-${Date.now()}`
        };
        addUser(newUser);
    }
    setIsUserModalOpen(false);
  };

  // --- CATEGORY HANDLERS ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryId && newCategoryName) {
        addCategory({ id: newCategoryId, name: newCategoryName });
        setNewCategoryId('');
        setNewCategoryName('');
    }
  };

  // --- FACILITY HANDLERS ---
  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFacilityName) {
        addFacility(newFacilityName);
        setNewFacilityName('');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="text-indigo-600" /> Admin Panel
        </h1>
        <p className="text-gray-500">System configuration and user management.</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            Manage Users
        </button>
        <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'categories' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            Room Categories
        </button>
        <button
            onClick={() => setActiveTab('facilities')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'facilities' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            Facilities
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
        
        {/* USERS TAB */}
        {activeTab === 'users' && (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Users Directory</h2>
                    <button onClick={handleAddUser} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                        <Plus size={16} /> Add User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${
                                            u.role === 'admin' ? 'bg-pink-100 text-pink-700' : 
                                            u.role === 'dosen' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button onClick={() => handleEditUser(u)} className="text-gray-400 hover:text-indigo-600"><Edit size={16} /></button>
                                        <button onClick={() => {if(confirm('Delete user?')) deleteUser(u.id)}} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
            <div className="p-6 max-w-2xl">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Room Categories</h2>
                
                <form onSubmit={handleAddCategory} className="flex gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input 
                        className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="ID (e.g. lab)"
                        value={newCategoryId}
                        onChange={e => setNewCategoryId(e.target.value)}
                        required
                    />
                    <input 
                        className="flex-[2] px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Label (e.g. Laboratories)"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add</button>
                </form>

                <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                                <Tag size={18} className="text-gray-400" />
                                <div>
                                    <span className="font-medium text-gray-800">{cat.name}</span>
                                    <span className="text-xs text-gray-400 ml-2 font-mono bg-gray-100 px-1 rounded">{cat.id}</span>
                                </div>
                            </div>
                            <button onClick={() => {if(confirm('Delete category?')) deleteCategory(cat.id)}} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded">
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* FACILITIES TAB */}
        {activeTab === 'facilities' && (
            <div className="p-6 max-w-xl">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Master Facilities List</h2>
                <p className="text-sm text-gray-500 mb-4">Add facilities here so they can be selected when creating rooms.</p>
                
                <form onSubmit={handleAddFacility} className="flex gap-4 mb-6">
                    <input 
                        className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="New Facility Name"
                        value={newFacilityName}
                        onChange={e => setNewFacilityName(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                        <Plus size={16} /> Add
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {facilities.map(fac => (
                        <div key={fac} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
                            <span className="text-sm font-medium">{fac}</span>
                            <button onClick={() => deleteFacility(fac)} className="text-indigo-400 hover:text-red-500">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold mb-4">{editingUser.id ? 'Edit User' : 'Add New User'}</h3>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input 
                            required type="text" 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 outline-none"
                            value={editingUser.name || ''}
                            onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            required type="email" 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 outline-none"
                            value={editingUser.email || ''}
                            onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['mahasiswa', 'dosen', 'admin'] as Role[]).map(r => (
                                <button
                                    key={r} type="button"
                                    onClick={() => setEditingUser({...editingUser, role: r})}
                                    className={`py-2 text-xs font-bold rounded uppercase ${
                                        editingUser.role === r ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 mt-4">Save User</button>
                    <button type="button" onClick={() => setIsUserModalOpen(false)} className="w-full text-gray-500 py-2 hover:text-gray-700">Cancel</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};