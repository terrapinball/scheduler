import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useAuth();
  return isAdmin ? children : <Navigate to="/login" />
}