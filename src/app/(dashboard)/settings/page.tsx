"use client";
import React, { useState } from 'react';
import { useTheme } from 'next-themes';

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

  return (
    <div className="px-8 lg:pt-8 pt-12 lg:pb-8 pb-12 max-w-4xl mx-auto lg:mx-4 overflow-y-scroll h-full">
      <div className="mb-8">
        <h1 className="lg:text-4xl text-3xl font-serif mb-1">
          Account <span className="text-[#D1376A]">Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="space-y-10">
        {/* Profile Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium border-b border-border pb-2">Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md transition">
              Update Profile
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium border-b border-border pb-2">Notifications</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#D1376A]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#D1376A]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between pb-3">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#D1376A]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* App Settings Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium border-b border-border pb-2">App Settings</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h3 className="text-base font-medium">Theme</h3>
              <div className="flex space-x-4">
                <button 
                  className={`px-4 py-2 rounded-md border ${theme === 'light' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setTheme('light')}
                >
                  Light
                </button>
                <button 
                  className={`px-4 py-2 rounded-md border ${theme === 'dark' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </button>
                <button 
                  className={`px-4 py-2 rounded-md border ${theme === 'system' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setTheme('system')}
                >
                  System
                </button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="text-base font-medium">Default Reflection Period</h3>
              <select 
                value={defaultReflectionPeriod}
                onChange={(e) => setDefaultReflectionPeriod(e.target.value)}
                className="w-full md:w-1/2 p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition"
              >
                <option value="3 days">3 days</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
              </select>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium border-b border-border pb-2">Privacy & Data</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h3 className="text-base font-medium">Data Storage</h3>
              <div className="flex space-x-4">
                <button 
                  className={`px-4 py-2 rounded-md border ${dataStorage === 'cloud' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setDataStorage('cloud')}
                >
                  Cloud Storage
                </button>
                <button 
                  className={`px-4 py-2 rounded-md border ${dataStorage === 'local' ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' : 'border-border'}`}
                  onClick={() => setDataStorage('local')}
                >
                  Local Only
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {dataStorage === 'cloud' 
                  ? 'Your data will be securely stored in the cloud and available across devices' 
                  : 'Your data will only be stored on this device and not synced'}
              </p>
            </div>
            
            <div className="flex items-center justify-between pb-3">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#D1376A]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Export Data Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium border-b border-border pb-2">Export Your Data</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Download a copy of all your decision data in JSON format
            </p>
            <button 
              onClick={handleExportData}
              className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md transition"
            >
              Export Data
            </button>
          </div>
        </section>

        {/* Delete Account Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium border-b border-border pb-2 text-red-500">Delete Account</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            {!showDeleteConfirmation ? (
              <button 
                onClick={() => setShowDeleteConfirmation(true)}
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md transition"
              >
                Delete Account
              </button>
            ) : (
              <div className="border border-red-300 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                <p className="font-medium text-red-600 dark:text-red-400 mb-3">
                  Are you sure you want to delete your account?
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md transition"
                  >
                    Yes, Delete Account
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;