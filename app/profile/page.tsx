'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { Alert } from 'antd';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: '',
    phone: '',
    image:
      'https://a.storyblok.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp',
    username: 'john_poe03',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    reEnterNewPassword: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8083/v1/users/details/${user.username}`
        );
        const data = await response.json();
        setUser((prevUser) => ({
          ...prevUser,
          name: data.name,
          phone: data.phoneNumber,
        }));
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user.username]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    if (name in passwords) {
      setPasswords((prevPasswords) => ({ ...prevPasswords, [name]: value }));
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        name: user.name,
        phoneNumber: user.phone,
      };

      const response = await fetch(`http://localhost:8083/v1/users/update/${user.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUser((prevUser) => ({
          ...prevUser,
          name: data.name,
          phone: data.phoneNumber,
        }));
        setIsEditing(false);
        setUpdateSuccess(true);
      } else {
        const errorData = await response.json();
        console.error('Error updating user details:', errorData);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {updateSuccess && (
        <Alert
          message="User details updated successfully"
          type="success"
          showIcon
          closable
          onClose={() => setUpdateSuccess(false)}
        />
      )}
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4 group">
          <div
            className={`w-full h-full rounded-full ${
              isEditing ? 'group-hover:border-2 group-hover:border-black' : ''
            }`}
          >
            <img
              src={user.image}
              alt="Profile Image"
              className={`w-full h-full object-cover rounded-full ${
                isEditing ? 'group-hover:blur-sm' : ''
              }`}
            />
          </div>
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
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
          </>
        )}
      </div>
      {!isEditing && (
        <div className="flex justify-center">
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </div>
  );
}
