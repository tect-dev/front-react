import Navbar from '../components/layout/Navbar'

export default function MainWrapper({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
