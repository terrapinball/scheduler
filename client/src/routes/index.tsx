import { Routes, Route } from 'react-router-dom'
import Home from './public/pages/Home'
import { RequireAuth } from './admin/components/RequireAuth'
import AdminLayout from './admin/components/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import Users from './admin/pages/Users'

export const AppRoutes = () => (
 <Routes>
   <Route path="/" element={<Home />} />
   <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
     <Route index element={<Dashboard />} />
     <Route path="users" element={<Users />} />
   </Route>
 </Routes>
)