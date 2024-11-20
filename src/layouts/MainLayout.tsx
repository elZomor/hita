import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/Header';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">{<Outlet />}</main>
    </div>
  );
};

export default MainLayout;
