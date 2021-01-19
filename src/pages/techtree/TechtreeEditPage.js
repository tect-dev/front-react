import TechtreeEditor from '../../components/techtree/TechtreeEditor'
import React from 'react'
import MainLayout from '../../components/layout/MainLayout'
import '../../styles/page/HomePage.scss'
import { dummyTechtree } from '../../lib/dummyTechtree'

export default function HomePage() {
  return (
    <>
      <MainLayout>
        <div className="homepage-container">
          <main className="techtree-container">
            <TechtreeEditor techtreeData={dummyTechtree.cs} category={'cs'} />
          </main>
        </div>
      </MainLayout>
    </>
  )
}
