'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    phone: '(+94) 456-7890',
    image:
      'https://a.storyblok.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    reEnterNewPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in passwords) {
      setPasswords((prevPasswords) => ({ ...prevPasswords, [name]: value }));
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4 group">
          <div className={`w-full h-full rounded-full ${isEditing ? 'group-hover:border-2 group-hover:border-black' : ''}`}>
            <img
              src={user.image}
              alt="Profile Image"
              className={`w-full h-full object-cover rounded-full ${isEditing ? 'group-hover:blur-sm' : ''}`}
            />
          </div>
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        {/* value section */}
        {isEditing ? (
          <>
            <div className="flex justify-between w-[30rem] mb-6">
              <span className="font-medium">Name:</span>
              <Input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="ml-2 h-6 w-64"
              />
            </div>
            <div className="flex justify-between w-[30rem] mb-6">
              <span className="font-medium">Phone:</span>
              <Input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="ml-2 h-6 w-64"
              />
            </div>
            <div className="flex justify-between w-[30rem] mb-6">
              <span className="font-medium">Current Password:</span>
              <Input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                className="ml-2 h-6 w-64"
              />
            </div>
            <div className="flex justify-between w-[30rem] mb-6">
              <span className="font-medium">New Password:</span>
              <Input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="ml-2 h-6 w-64"
              />
            </div>
            <div className="flex justify-between w-[30rem] mb-6">
              <span className="font-medium">Re-enter New Password:</span>
              <Input
                type="password"
                name="reEnterNewPassword"
                value={passwords.reEnterNewPassword}
                onChange={handleChange}
                className="ml-2 h-6 w-64"
              />
            </div>
            <div className="flex justify-between w-[30rem]">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between w-[30rem] mb-6">
              <span className="font-medium">Name:</span>
              <span className="text-right">{user.name}</span>
            </div>
            <div className="flex justify-between w-[30rem] mb-6">
              <span className="font-medium">Phone:</span>
              <span className="text-right">{user.phone}</span>
            </div>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </>
        )}
      </div>
    </div>
  );
}
