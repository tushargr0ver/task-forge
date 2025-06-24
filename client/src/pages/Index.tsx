
import { useState } from 'react';
import { LoginPage } from '@/components/LoginPage';
import { RegisterPage } from '@/components/RegisterPage';
import { Dashboard } from '@/components/Dashboard';

type AuthPage = 'login' | 'register' | 'dashboard';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<AuthPage>('login');

  const handleLogin = (email: string, password: string) => {
    console.log('Login successful:', { email });
    setCurrentPage('dashboard');
  };

  const handleRegister = (name: string, email: string, password: string) => {
    console.log('Registration successful:', { name, email });
    setCurrentPage('login');
  };

  const handleLogout = () => {
    console.log('Logout successful');
    setCurrentPage('login');
  };

  if (currentPage === 'dashboard') {
    return <Dashboard />;
  }

  if (currentPage === 'register') {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onNavigateToLogin={() => setCurrentPage('login')}
      />
    );
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onNavigateToRegister={() => setCurrentPage('register')}
    />
  );
};

export default Index;
