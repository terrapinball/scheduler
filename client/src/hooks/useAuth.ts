// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { User } from '../types';
import { verifyToken } from '../services/authService';

export const useAuth = () => {
 const [user, setUser] = useState<User | null>(null)
 
 useEffect(() => {
   // Check JWT in localStorage
   const token = localStorage.getItem('token')
   if (token) {
     // Verify token with backend
     verifyToken(token)
       .then(userData => setUser(userData))
       .catch(() => {
         localStorage.removeItem('token')
         setUser(null)
       })
   }
 }, [])

 const isAdmin = user?.role === 'admin'

 const login = async (credentials: {email: string, password: string}) => {
   const response = await fetch('/api/login', {
     method: 'POST',
     body: JSON.stringify(credentials)
   })
   const { token, user } = await response.json()
   localStorage.setItem('token', token)
   setUser(user)
 }

 const logout = () => {
   localStorage.removeItem('token')
   setUser(null)
 }

 return { user, isAdmin, login, logout }
}