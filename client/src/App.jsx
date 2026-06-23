import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#01161E',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              fontFamily: 'var(--sans)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;