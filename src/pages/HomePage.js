import React, { useState } from 'react'
import MainLayout from '../components/MainLayout'
//import '../styles/Home.module.css';

import ForceGraph from '../components/home/ForceGraph'
import OrbitGraph from '../components/home/OrbitGraph'
import SubjectBlock from '../components/home/SubjectBlock'
import { dummyTechtree } from '../lib/dummyTechtree'

export default function HomePage() {
  const [onPhysics, setOnPhysics] = useState(true)
  return (
    <>
      <MainLayout>
        <div className="container">
          <main>
            {onPhysics ? (
              <OrbitGraph techtreeData={dummyTechtree.physics} category={'physics'} />
            ) : (
              <ForceGraph techtreeData={dummyTechtree.cs} category={'cs'} />
            )}
          </main>
          <aside className="sidebar">
            <div
              onClick={() => {
                console.log('physics clicked')
                setOnPhysics(true)
              }}
              className="block"
            >
              <SubjectBlock iconSize="70" url="physics" displayedName="physics" />
            </div>

            <div
              onClick={() => {
                console.log('cs clicked')
                setOnPhysics(false)
              }}
              className="block"
            >
              <SubjectBlock iconSize="50" url="computer" displayedName="Computer Science" />
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/math.svg" alt="mathematicsIcon" height="70" width="70" />
              <br />
              Mathematics
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/economics.svg" alt="economicsIcon" height="70" width="70" />
              <br />
              economics
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/chemistry.svg" height="70" width="70" />
              <br />
              Chemistry
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/biochemistry.svg" height="70" width="70" />
              <br />
              Biochemistry
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/russia.svg" height="70" width="70" />
              <br />
              Russia
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/electricity.svg" height="50" width="50" />
              <br />
              Electrical Engineering
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/earth.svg" height="50" width="50" />
              <br />
              Earth System
            </div>
          </aside>
        </div>
      </MainLayout>
    </>
  )
}
