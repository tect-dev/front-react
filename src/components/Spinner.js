import React from 'react'
import '../styles/spinner.scss'
import styled, { keyframes } from 'styled-components'

export const Spinner = () => {
  return (
    <>
      {/* <div className="spinner-1" />
      <div className="loading-text">Loading...</div> */}
      <Spinner1 />
      <Text>Loading...</Text>
    </>
  )
}

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner1 = styled.div`
  &:before {
    content: '';
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    height: 45px;
    width: 45px;
    margin: -30px 0 0 -30px;
    border-radius: 50%;
    border: 3px solid lightgray;
    border-top-color: #6d9b7b;
    z-index: 100;
    animation: ${rotate} 0.7s linear infinite;
  }
`

const Text = styled.div`
  color: #6d9b7b;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: 20px 0 0 -35px;
`