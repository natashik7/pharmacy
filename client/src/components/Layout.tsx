import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './ui/Navbar';

function Layout(): JSX.Element {
  return (
    <>
    <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;