import { Routes, Route } from 'react-router-dom'; // Remove 'BrowserRouter as Router'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    // <Router>  <-- REMOVE THIS LINE
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    // </Router> <-- AND THIS LINE
  );
}

export default App;