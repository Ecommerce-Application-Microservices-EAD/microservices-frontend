"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import axios from 'axios'
import { useAuth } from "@/context/AuthProvider"

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {

      await login(username, password);
      setError("");
    
    } catch (err: any) {
     
      setError(err.message);
    
    }
    
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
          {error && <Label className='text-red-500 text-sm'>{error}</Label> }
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
          <Button type="submit" className="w-full">Login</Button>
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => router.push('/auth/signup')}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </CardFooter>
        </form>
      </Card>
    </div>
  )
}