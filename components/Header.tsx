'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  User,
  LogOut,
  Moon,
  Sun,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import { FaClipboardList } from 'react-icons/fa';
import { decode } from 'jwt-js-decode';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, logout, token } = useAuth();

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated && token) {
      const decodedToken = decode(token);
      console.log('Decoded JWT Payload:', decodedToken.payload);
    }
  }, [isAuthenticated, token]);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          NextShop
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/orders">
            <Button variant="ghost" size="icon" className="relative">
              <FaClipboardList className="h-5 w-5" />
            </Button>
          </Link>

          {!isAuthenticated ? (
            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
                className="flex items-center space-x-1"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
