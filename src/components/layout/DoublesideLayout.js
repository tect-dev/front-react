import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import '../../styles/layout/MainLayout.scss'

const DoublesideLayout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-main-doubleside">{children}</div>
      {/*<Footer />*/}
    </div>
  )
}

export default DoublesideLayout
