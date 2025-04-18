"use client";
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  // User profile settings
  const [name, setName] = useState('Hope Jensen');
  const [email, setEmail] = useState('hope@example.com');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reflectionReminders, setReflectionReminders] = useState(true);
  const [insightUpdates, setInsightUpdates] = useState(false);
  
  // App settings
  const { theme, setTheme } = useTheme();
  const [defaultReflectionPeriod, setDefaultReflectionPeriod] = useState('1 week');
  
  // Privacy settings
  const [dataStorage, setDataStorage] = useState('cloud');
  const [aiAssistance, setAiAssistance] = useState(true);
  
  // Export data
  const handleExportData = () => {
    // In a real implementation, this would generate and download user data
    alert('Your data export is being prepared. It will download shortly.');
  };
  
  // Delete account
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const handleDeleteAccount = () => {
    // In a real implementation, this would trigger account deletion
    alert('Account deletion request submitted. You will receive an email confirmation.');
    setShowDeleteConfirmation(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.23, 1, 0.32, 1] 
      }
    }
  };

  const buttonHoverVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97 }
  };

  // Toggle switch animation
  const toggleSwitchVariants = (isChecked: boolean) => ({
    initial: { backgroundColor: isChecked ? "rgb(209, 55, 106)" : "rgb(203 213 225)" },
    animate: { 
      backgroundColor: isChecked ? "rgb(209, 55, 106)" : "rgb(203 213 225)",
      transition: { duration: 0.2 }
    }
  });

  return (
    <motion.div 
      className="px-8 lg:pt-8 pt-12 lg:pb-8 pb-12 max-w-4xl mx-auto lg:mx-4 overflow-y-scroll h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="mb-8"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="lg:text-4xl text-3xl font-serif mb-1">
          Account <span className="text-[#D1376A]">Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </motion.div>

      <motion.div 
        className="space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Section */}
        <motion.section 
          className="space-y-4"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-medium border-b border-border pb-2">Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 2px rgba(209, 55, 106, 0.3)" }}
                id="name"
                type="text"
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 2px rgba(209, 55, 106, 0.3)" }}
                id="email"
                type="email"
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
          </div>
          
          <div className="pt-2">
            <motion.button 
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md transition"
            >
              Update Profile
            </motion.button>
          </div>
        </motion.section>

        {/* Notifications Section */}
        <motion.section 
          className="space-y-4"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-medium border-b border-border pb-2">Notifications</h2>
          
          <div className="space-y-3">
            <motion.div 
              className="flex items-center justify-between border-b border-border/50 pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div>
                <h3 className="text-base font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emailNotifications} 
                  onChange={() => setEmailNotifications(!emailNotifications)} 
                  className="sr-only peer" 
                />
                <motion.div 
                  className="w-11 h-6 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                  variants={toggleSwitchVariants(emailNotifications)}
                  initial="initial"
                  animate="animate"
                ></motion.div>
              </label>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between border-b border-border/50 pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div>
                <h3 className="text-base font-medium">Reflection Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Get reminded when a reflection is due
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={reflectionReminders} 
                  onChange={() => setReflectionReminders(!reflectionReminders)} 
                  className="sr-only peer" 
                />
                <motion.div 
                  className="w-11 h-6 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                  variants={toggleSwitchVariants(reflectionReminders)}
                  initial="initial"
                  animate="animate"
                ></motion.div>
              </label>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <div>
                <h3 className="text-base font-medium">Insight Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Notify me when new insights are available
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={insightUpdates} 
                  onChange={() => setInsightUpdates(!insightUpdates)} 
                  className="sr-only peer" 
                />
                <motion.div 
                  className="w-11 h-6 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                  variants={toggleSwitchVariants(insightUpdates)}
                  initial="initial"
                  animate="animate"
                ></motion.div>
              </label>
            </motion.div>
          </div>
        </motion.section>

        {/* App Settings Section */}
        <motion.section 
          className="space-y-4"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-medium border-b border-border pb-2">App Settings</h2>
          
          <div className="space-y-6">
            <motion.div 
              className="flex flex-col space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <h3 className="text-base font-medium">Theme</h3>
              <div className="flex space-x-4">
                <motion.button 
                  className={`px-4 py-2 rounded-md border ${theme === 'light' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setTheme('light')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Light
                </motion.button>
                <motion.button 
                  className={`px-4 py-2 rounded-md border ${theme === 'dark' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setTheme('dark')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Dark
                </motion.button>
                <motion.button 
                  className={`px-4 py-2 rounded-md border ${theme === 'system' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setTheme('system')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  System
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <h3 className="text-base font-medium">Default Reflection Period</h3>
              <motion.select 
                value={defaultReflectionPeriod}
                onChange={(e) => setDefaultReflectionPeriod(e.target.value)}
                className="w-full md:w-1/2 p-3 border border-border rounded-md bg-background focus:outline-none transition"
                whileFocus={{ boxShadow: "0 0 0 2px rgba(209, 55, 106, 0.3)" }}
              >
                <option value="3 days">3 days</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
              </motion.select>
            </motion.div>
          </div>
        </motion.section>

        {/* Privacy Section */}
        <motion.section 
          className="space-y-4"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-medium border-b border-border pb-2">Privacy & Data</h2>
          
          <div className="space-y-6">
            <motion.div 
              className="flex flex-col space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <h3 className="text-base font-medium">Data Storage</h3>
              <div className="flex space-x-4">
                <motion.button 
                  className={`px-4 py-2 rounded-md border ${dataStorage === 'cloud' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setDataStorage('cloud')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Cloud Storage
                </motion.button>
                <motion.button 
                  className={`px-4 py-2 rounded-md border ${dataStorage === 'local' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setDataStorage('local')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Local Only
                </motion.button>
              </div>
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {dataStorage === 'cloud' 
                  ? 'Your data will be securely stored in the cloud and available across devices' 
                  : 'Your data will only be stored on this device and not synced'}
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              <div>
                <h3 className="text-base font-medium">AI Assistance</h3>
                <p className="text-sm text-muted-foreground">
                  Allow AI to analyze your decisions to provide insights
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={aiAssistance} 
                  onChange={() => setAiAssistance(!aiAssistance)} 
                  className="sr-only peer" 
                />
                <motion.div 
                  className="w-11 h-6 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                  variants={toggleSwitchVariants(aiAssistance)}
                  initial="initial"
                  animate="animate"
                ></motion.div>
              </label>
            </motion.div>
          </div>
        </motion.section>

        {/* Export Data Section */}
        <motion.section 
          className="space-y-4"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-medium border-b border-border pb-2">Export Your Data</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Download a copy of all your decision data in JSON format
            </p>
            <motion.button 
              onClick={handleExportData}
              className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Export Data
            </motion.button>
          </div>
        </motion.section>

        {/* Delete Account Section */}
        <motion.section 
          className="space-y-4"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-medium border-b border-border pb-2 text-red-500">Delete Account</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            {!showDeleteConfirmation ? (
              <motion.button 
                onClick={() => setShowDeleteConfirmation(true)}
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                Delete Account
              </motion.button>
            ) : (
              <motion.div 
                className="border border-red-300 bg-red-50 dark:bg-red-900/20 p-4 rounded-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <p className="font-medium text-red-600 dark:text-red-400 mb-3">
                  Are you sure you want to delete your account?
                </p>
                <div className="flex space-x-3">
                  <motion.button 
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    Yes, Delete Account
                  </motion.button>
                  <motion.button 
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;