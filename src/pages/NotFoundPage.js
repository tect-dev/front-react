import axios from 'axios'
import React from 'react'
import MainLayout from '../components/layout/MainLayout'

export default function AboutPage() {
  React.useEffect(() => {
    const res = axios({
      method: 'get',
      url: process.env.REACT_APP_BACKEND_URL,
    }).then(() => {
      console.log(':', res)
    })
  }, [])
  return (
    <>
      <MainLayout>Not Found!</MainLayout>
    </>
  )
}
