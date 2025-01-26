import { User } from '../types';

const mockUser: User = {
    id: '123',
    role: 'admin'
}

export const verifyToken = async (token: string): Promise<boolean> => {
    const response = await fetch('/api/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Invalid token')
    }
   
    // return response.json()
    console.log('auth\'d');
    return true;
   }