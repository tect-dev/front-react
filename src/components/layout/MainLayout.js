import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import '../../styles/layout/MainLayout.scss'

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-main">{children}</div>
      <Footer />
    </div>
  )
}
