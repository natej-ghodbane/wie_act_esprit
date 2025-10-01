import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Camera,
  Save,
  ArrowLeft,
  Sun,
  Moon,
  Lock,
  Edit
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  farmLocation?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export default function VendorProfile() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    farmLocation: '',
    address: '',
    bio: '',
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'farmer') {
        router.push('/auth/login');
        return;
      }
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        farmLocation: parsedUser.farmLocation || '',
        address: parsedUser.address || '',
        bio: parsedUser.bio || '',
      });
    } catch (error) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to update user profile
      console.log('Saving profile:', formData);
      
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser as UserProfile);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-700 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
          : 'bg-gradient-to-br from-purple-100 via-pink-100 to-fuchsia-100'
      }`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-300 border-l-transparent shadow-lg"
            />
            <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-500" />
          </div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
          >
            Loading your profile...
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
        : 'bg-gradient-to-br from-purple-100 via-pink-100 to-fuchsia-100'
    }`}>
      {/* Animated gradient blobs for light mode */}
      {!isDarkMode && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-400/40 to-rose-400/40 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <motion.button
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/vendor/dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl mb-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm' 
                : 'bg-white/60 hover:bg-white/70 text-gray-700 shadow-lg border border-purple-300/80'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </motion.button>

          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-2"
              >
                Profile Settings
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
              >
                Manage your personal information
              </motion.p>
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-purple-800/30 border-purple-700/50 text-yellow-400' 
                  : 'bg-white/60 border-purple-300/80 text-purple-900'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`backdrop-blur-xl rounded-3xl border shadow-lg overflow-hidden ${
            isDarkMode 
              ? 'bg-purple-900/40 border-purple-700/50' 
              : 'bg-white/60 border-purple-300/80'
          }`}
        >
          {/* Profile Header with Image */}
          <div className="relative h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden border-4 border-white shadow-xl">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user.firstName, user.lastName)
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.firstName} {user.lastName}
                </h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isEditing
                    ? 'bg-gray-500 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                }`}
              >
                <Edit className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </motion.button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    First Name
                  </label>
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl backdrop-blur-sm ${
                    isDarkMode ? 'bg-purple-800/40' : 'bg-purple-100/50'
                  }`}>
                    <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                      className={`flex-1 bg-transparent outline-none ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } ${!isEditing && 'cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Name
                  </label>
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl backdrop-blur-sm ${
                    isDarkMode ? 'bg-purple-800/40' : 'bg-purple-100/50'
                  }`}>
                    <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                      className={`flex-1 bg-transparent outline-none ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } ${!isEditing && 'cursor-not-allowed'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-purple-800/40' : 'bg-purple-100/50'
                }`}>
                  <Mail className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className={`flex-1 bg-transparent outline-none ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } ${!isEditing && 'cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Number
                </label>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-purple-800/40' : 'bg-purple-100/50'
                }`}>
                  <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                    className={`flex-1 bg-transparent outline-none ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    } ${!isEditing && 'cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Farm Location */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Farm Location
                </label>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-purple-800/40' : 'bg-purple-100/50'
                }`}>
                  <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <input
                    type="text"
                    value={formData.farmLocation}
                    onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter farm location"
                    className={`flex-1 bg-transparent outline-none ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    } ${!isEditing && 'cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Address
                </label>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-purple-800/40' : 'bg-purple-100/50'
                }`}>
                  <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter full address"
                    className={`flex-1 bg-transparent outline-none ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    } ${!isEditing && 'cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Bio
                </label>
                <div className={`px-4 py-3 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-purple-800/40' : 'bg-purple-100/50'
                }`}>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about your farm..."
                    rows={4}
                    className={`w-full bg-transparent outline-none resize-none ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    } ${!isEditing && 'cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-8 backdrop-blur-xl rounded-3xl border shadow-lg p-8 ${
            isDarkMode 
              ? 'bg-purple-900/40 border-purple-700/50' 
              : 'bg-white/60 border-purple-300/80'
          }`}
        >
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Security Settings
          </h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl ${
              isDarkMode ? 'bg-purple-800/40 hover:bg-purple-800/50' : 'bg-purple-100/50 hover:bg-purple-200/50'
            } transition-all duration-300`}
          >
            <div className="flex items-center space-x-3">
              <Lock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div className="text-left">
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Change Password
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Update your password regularly
                </p>
              </div>
            </div>
            <ArrowLeft className={`w-5 h-5 rotate-180 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
