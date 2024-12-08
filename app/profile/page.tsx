'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

export default function ProfilePage() {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:9000/api/user/change-password',
        {
          username: user?.sub,
          oldPassword: currentPassword,
          newPassword: newPassword,
        }
      );
      console.log(response.data);
      alert("Password changed successfully");
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      const errorMessage = (error as any).response?.data || (error as any).message;
      console.error(errorMessage);
      if (errorMessage === "Invalid credentials") {
        alert("Current password is incorrect");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Profile Page</h1>
      <p>Username: {user?.sub}</p>
      {!showChangePassword ? (
        <Button onClick={() => setShowChangePassword(true)}>
          Change Password
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-4">
            <Button type="submit">Submit</Button>
            <Button 
              type="button" 
              onClick={() => setShowChangePassword(false)} 
              className="bg-white border border-black text-black hover:bg-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
