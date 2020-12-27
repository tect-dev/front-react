import React from 'react';
import Navbar from './Navbar';

export default function MainLayout({ children }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
    </>
  );
}
