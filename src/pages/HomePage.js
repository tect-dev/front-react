import React from 'react';
import MainLayout from '../components/MainLayout';
//import '../styles/Home.module.css';

import { ForceGraph } from '../components/home/ForceGraph';
import { dummyTechtree } from '../lib/dummyTechtree';

export default function HomePage() {
  return (
    <>
      <MainLayout>
        <div className="container">
          <main>
            <ForceGraph techtreeData={dummyTechtree.cs} category={'cs'} />
          </main>
          <aside className="sidebar">
            <div
              onClick={() => {
                console.log('physics clicked');
              }}
              className="block"
            >
              <img
                src="/icons/physics.svg"
                alt="physics"
                height="70"
                width="70"
              />
              <br />
              Physics
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/math.svg" height="70" width="70" />
              <br />
              Mathematics
            </div>

            <div onClick={() => {}} className="block">
              <img src="/icons/economics.svg" height="70" width="70" />
              <br />
              economics
            </div>

            <div
              onClick={() => {
                console.log('cs clicked');
              }}
              className="block"
            >
              <img src="/icons/computer.svg" height="50" width="50" />
              <br />
              Computer Science
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
  );
}
