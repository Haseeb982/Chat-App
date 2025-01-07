import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth/page'
import Chat from './pages/chat/page'
import Profile from './pages/profile/page'
import { useAuthStore } from '@/store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utiles/constant';
import { useEffect } from 'react';


const PrivateRoutes = ({ children }) => {
  const { userInfo } = useAuthStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoutes = ({ children }) => {
  const { userInfo } = useAuthStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

function App() {
  const { userInfo, setUserInfo } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        console.log("get user info is running ");
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        console.log("get user info response", response.data.id);
        if (response.status === 200 || response.data.id) {
          console.log("user info is this on app.jsx",  response.data.id )
          setUserInfo(response.data)
        } else {
          setUserInfo(undefined)
        }
        console.log({ response })
      } catch (error) {
        
        console.log('error in get user info on app.jsx: ', error.message);
        setUserInfo(undefined)
      } finally {
        setIsLoading(false)
      }
    }
    if (!userInfo) {
      getUserData();
    } else {
      setIsLoading(false)
    }
  }, [userInfo, setUserInfo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={
            <AuthRoutes>
              <Auth />
            </AuthRoutes>} />
          <Route path="/chat" element={
            <PrivateRoutes>
              <Chat />
            </PrivateRoutes>} />
          <Route path="/profile" element={
            <PrivateRoutes>
              <Profile />
            </PrivateRoutes>} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
