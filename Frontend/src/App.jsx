import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signup from "./pages/Auth/pages/Signup/Signup.jsx"
import Login from "./pages/Auth/pages/login/login"
import Forget from "./pages/Auth/pages/Forget/Forget"
import Home from './Home/Home.jsx'
import UserAccount from "./pages/Admin/pages/UserAccount.jsx"
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./pages/Admin/context/UserContext";
import UpdateInfo from "./pages/Admin/components/UpdateInfo.jsx"
import { ChatProvider } from "./pages/Landing/context/ChatContext";
import { UserData } from "./pages/Auth/context/AuthContext";

function AppContent() {
  const { isAuthenticated } = UserData();

  return (
    <UserProvider>
      <ChatProvider isAuthenticated={isAuthenticated}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="/UserAccount" element={<UserAccount />} />
          <Route path='/update' element={<UpdateInfo />} />
        </Routes>
      </ChatProvider>
    </UserProvider>
  );
}

function App() {
  return (
    <>
      <div>
        <Toaster position="top-center" />
        <Router>
          <AppContent />
        </Router>
      </div>
    </>
  )
}

export default App
