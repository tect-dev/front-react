import styled from 'styled-components'
import Navbar from '../components/layout/Navbar'

export default function ({ children }) {
  return (
    <MainLayout>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
    </MainLayout>
  )
}

const MainLayout = styled.div`
  align-items: center; /* layout 1 */
  width: 100%;
  min-height: 100vh; /* layout 4 */
`

const ContentWrapper = styled.main`
  margin-top: 100px;
`
