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
              background: '#1C1C1C',
              color: '#F3F3F3',
              border: '1px solid #3C3C3C',
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