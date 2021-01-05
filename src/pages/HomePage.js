import React, { useState } from 'react'
import MainLayout from '../components/MainLayout'
//import '../styles/Home.module.css';

import ForceGraph from '../components/home/ForceGraph'
import OrbitGraph from '../components/home/OrbitGraph'
import SubjectBlock from '../components/home/SubjectBlock'
import { dummyTechtree } from '../lib/dummyTechtree'
import ClusteredForceGraph from '../components/home/ClusteredForceGraph'

export default function HomePage() {
  const [onPhysics, setOnPhysics] = useState(true)
  const [selected, setSelected] = useState('physics')

  const TechtreeGraph = ({ subject }) => {
    switch (subject) {
      case 'physics':
        return <OrbitGraph techtreeData={dummyTechtree.physics} category={'physics'} />
      case 'cs':
        return <ForceGraph techtreeData={dummyTechtree.cs} category={'cs'} />
      case 'politics':
        return <ClusteredForceGraph techtreeData={dummyTechtree.politics} category={'politics'} />
    }
  }
  return (
    <>
      <MainLayout>
        <div className="container">
          <main>
            <TechtreeGraph subject={selected} />
          </main>
          <aside className="sidebar">
            <div
              onClick={() => {
                console.log('physics clicked')
                //setOnPhysics(true)
                setSelected('physics')
              }}
              className="block"
            >
              <SubjectBlock iconSize="70" url="physics" displayedName="물리학" />
            </div>

            <div
              onClick={() => {
                console.log('cs clicked')
                //setOnPhysics(true)
                setSelected('cs')
              }}
              className="block"
            >
              <SubjectBlock iconSize="50" url="computer" displayedName="컴퓨터과학" />
            </div>

            <div
              onClick={() => {
                console.log('cs clicked')
                //   setOnPhysics(false)
                setSelected('politics')
              }}
              className="block"
            >
              <SubjectBlock iconSize="50" url="computer" displayedName="정치외교학" />
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
