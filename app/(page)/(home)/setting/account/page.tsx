"use client"
import React from 'react';
import SettingsSidebar from '../Sidebar/page';
import ProfileSettings from '../profile/page';
import ChangeEmail from './ChangeEmail/page';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('account-info');
  
  // Get the heading based on active tab
  const getHeading = () => {
    switch(activeTab) {
      case 'account-info':
        return 'Account Information';
      case 'change-email':
        return 'Change Email';
      case 'password':
        return 'Set Password';
      default:
        return 'Account Information';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 min-h-screen bg-[#0A1628] shadow-xl">
          <h1 className="text-2xl font-bold text-white p-6">
            Account Settings
          </h1>
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">{getHeading()}</h2>
            </div>
            
            {activeTab === 'account-info' && <ProfileSettings />}
            {activeTab === 'change-email' && <ChangeEmail />}
            {activeTab === 'password' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Set Password</h3>
                <p className="text-gray-600 mb-4">A password has not been set for you account.</p>
                {/* Password form would go here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}