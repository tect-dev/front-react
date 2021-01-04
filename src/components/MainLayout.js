import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
