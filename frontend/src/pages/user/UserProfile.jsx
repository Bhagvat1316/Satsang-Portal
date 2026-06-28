import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const UserProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({ userId: '', username: '', fullName: '', email: '', role: '', status: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await userService.getMe();
      setProfileData({
        userId: data.userId || '',
        username: data.username || '',
        fullName: data.fullName || '',
        email: data.email || '',
        role: data.role || '',
        status: data.status || ''
      });
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!profileData.username.trim() || !profileData.fullName.trim()) {
      addToast('Username and Full Name are required.', 'error');
      return;
    }

    if (profileData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        addToast('Invalid email format.', 'error');
        return;
      }
    }

    setIsSavingProfile(true);
    try {
      await userService.updateMe({
        username: profileData.username.trim(),
        fullName: profileData.fullName.trim(),
        email: profileData.email.trim()
      });
      addToast('Profile updated successfully', 'success');
      await fetchProfile();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      addToast('All password fields are required.', 'error');
      return;
    }

    if (passwords.new.length < 6) {
      addToast('New password must be at least 6 characters long.', 'error');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      addToast('New passwords do not match.', 'error');
      return;
    }

    setIsSavingPassword(true);
    try {
      await authService.changePassword(passwords.current, passwords.new);
      
      addToast('Password changed successfully. Please login again.', 'success');
      
      setPasswords({ current: '', new: '', confirm: '' });
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to change password', 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal information and account settings." 
      />

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <Card.Header title="Profile Information" />
            <Card.Body>
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-md border border-surface-container-highest">
                  <div className="flex flex-col">
                    <span className="text-label-sm text-onSurface-variant uppercase">User ID</span>
                    <span className="font-medium text-onSurface">{profileData.userId}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={profileData.role === 'ADMIN' ? 'primary' : 'default'}>{profileData.role}</Badge>
                    <Badge variant={profileData.status === 'ACTIVE' ? 'success' : 'default'}>{profileData.status}</Badge>
                  </div>
                </div>

                <Input 
                  label="Username" 
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  disabled={isSavingProfile}
                  placeholder="Choose a unique username"
                />
                
                <Input 
                  label="Full Name" 
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  disabled={isSavingProfile}
                  placeholder="Enter your full name"
                />
                
                <Input 
                  type="email"
                  label="Email (Optional)" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={isSavingProfile}
                  placeholder="Enter your email address"
                />

                <Button 
                  type="submit" 
                  className="mt-2 w-full md:w-auto self-start"
                  isLoading={isSavingProfile}
                  disabled={isSavingProfile}
                >
                  Save Changes
                </Button>
              </form>
            </Card.Body>
          </Card>

          {/* Change Password */}
          <Card>
            <Card.Header title="Change Password" />
            <Card.Body>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                <PasswordInput 
                  label="Current Password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  disabled={isSavingPassword}
                  placeholder="Enter current password"
                />
                <PasswordInput 
                  label="New Password" 
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  disabled={isSavingPassword}
                  placeholder="Minimum 6 characters"
                />
                <PasswordInput 
                  label="Confirm New Password" 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  disabled={isSavingPassword}
                  placeholder="Re-type new password"
                />
                <Button 
                  type="submit" 
                  className="mt-2 w-full md:w-auto self-start"
                  isLoading={isSavingPassword}
                  disabled={isSavingPassword}
                >
                  Update Password
                </Button>
              </form>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
