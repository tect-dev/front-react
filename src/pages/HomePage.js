import React, { useState } from 'react'
import MainLayout from '../components/MainLayout'
import SubjectBlock from '../components/home/SubjectBlock'
import '../styles/Techtree.module.css'
import homeStyles from '../styles/Home.module.css'
import TreeGraph from '../components/home/TreeGraph'
import ForceGraph from '../components/home/ForceGraph'
import OrbitGraph from '../components/home/OrbitGraph'
import SubjectBlockList from '../components/home/SubjectBlockList'
import { dummyTechtree } from '../lib/dummyTechtree'
import ClusteredForceGraph from '../components/home/ClusteredForceGraph'
import ConstellationGraph from '../components/home/ConstellationGraph'

export default function HomePage() {
  const [selected, setSelected] = useState('physicsConstellation')

  const TechtreeGraph = ({ subject }) => {
    switch (subject) {
      case 'physicsConstellation':
        return <ConstellationGraph techtreeData={dummyTechtree.physics} category={'physics'} />
      case 'physicsOrigin':
        return <TreeGraph techtreeData={dummyTechtree.physics} category={'physics'} />
      case 'physics':
        return <OrbitGraph techtreeData={dummyTechtree.physics} category={'physics'} />
      case 'math':
        return <TreeGraph techtreeData={dummyTechtree.cs} category={'cs'} />
      case 'cs':
        return <ForceGraph techtreeData={dummyTechtree.cs} category={'cs'} />
      case 'politics':
        return <ClusteredForceGraph techtreeData={dummyTechtree.politics} category={'politics'} />
      default:
        return <ForceGraph techtreeData={dummyTechtree.cs} category={'cs'} />
    }
  }
  return (
    <>
      <MainLayout>
        <TechtreeGraph subject={selected} />
        <SubjectBlockList>
          <div>
            <div
              onClick={() => {
                console.log('physics clicked')
                //setOnPhysics(true)
                setSelected('physicsConstellation')
              }}
              className={homeStyles.subjectBlock}
            >
              <SubjectBlock iconSize="70" url="physics" displayedName="물리학 별자리" />
            </div>
          </div>
          <div>
            <div
              onClick={() => {
                console.log('physics clicked')
                //setOnPhysics(true)
                setSelected('physicsOrigin')
              }}
              className={homeStyles.subjectBlock}
            >
              <SubjectBlock iconSize="70" url="physics" displayedName="물리학 트리" />
            </div>
          </div>
          <div>
            <div
              onClick={() => {
                console.log('physics clicked')
                //setOnPhysics(true)
                setSelected('physics')
              }}
              className={homeStyles.subjectBlock}
            >
              <SubjectBlock iconSize="70" url="physics" displayedName="물리학" />
            </div>
          </div>
          <div>
            <div
              onClick={() => {
                console.log('cs clicked')
                //setOnPhysics(true)
                setSelected('cs')
              }}
              className={homeStyles.subjectBlock}
            >
              <SubjectBlock iconSize="50" url="computer" displayedName="컴퓨터과학" />
            </div>
          </div>
          <div>
            <div
              onClick={() => {
                console.log('cs clicked')
                //   setOnPhysics(false)
                setSelected('politics')
              }}
              className={homeStyles.subjectBlock}
            >
              <SubjectBlock iconSize="50" url="computer" displayedName="정치외교학" />
            </div>
          </div>
        </SubjectBlockList>
      </MainLayout>
    </>
  )
}
