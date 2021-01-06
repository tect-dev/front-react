import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../styles/layout/MainLayout.scss'

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className="layout-main">
        { children }
      </div>
      <Footer />
    </div>
  );
}
