import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          closeOnClick
          pauseOnHover
          draggable
          hideProgressBar={false}
          newestOnTop={false}
          closeButton={true}
          toastStyle={{
            backgroundColor: '#FDE9EB',
            color: '#9C1621',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(156, 22, 33, 0.3)',
            zIndex: 9999
          }}
        />
      </div>
    </Router>
  );
};

export default App;