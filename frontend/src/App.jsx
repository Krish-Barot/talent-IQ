import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { useUser } from '@clerk/clerk-react'
import DashboardPage from './pages/DashboardPage';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  // To get rid of flickering section
  if(!isLoaded){
    return null;
  }
  return (

    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster />
    </>

  )
}

export default App
