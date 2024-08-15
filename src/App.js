import React from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

function App() {

  return (
    <Router>
      <main className="App">
        <Routes>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={ <Home /> } />
          <Route path='/admin-dashboard' element={ <AdminDashboard /> } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
