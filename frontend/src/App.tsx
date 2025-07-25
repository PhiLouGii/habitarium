import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Community from './pages/Community';
import { useAuth } from './context/AuthContext';
import { CommunityProvider } from './context/CommunityContext';

function App() {
  const { currentUser } = useAuth();

  return (
    <CommunityProvider currentUser={currentUser ? { // Pass currentUser to CommunityProvider
      id: currentUser.uid, 
      name: currentUser.displayName || 'Anonymous', 
      avatar: ''
    } : { 
      id: '',
      name: 'Anonymous',
      avatar: ''
    }}>
      <Router>
        <Routes>
      <Route path="/" element={<Signup />} />    
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/community" element={<Community />} />
    </Routes>
    </Router>
    </CommunityProvider>
  );
}

export default App;