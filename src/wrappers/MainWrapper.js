import styled from 'styled-components'
import Navbar from '../components/layout/Navbar'
import Fab from '@material-ui/core/Fab'
import { Container, Button, Link } from 'react-floating-action-button'

import { colorPalette } from '../lib/constants'

export default function MainWrapperExport({ children }) {
  return (
    <MainLayout>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
      <Container>
        <Link href="/" tooltip="나무 심기" icon="fa fa-sticky-note" />
        <Link
          href="/"
          tooltip="뭘 넣는게 좋을까 여기엔"
          icon="fa fa-user-plus"
        />

        <Link
          tooltip="내 숲으로 가기"
          icon="fa fa-plus"
          rotate={true}
          href="/"
        />
      </Container>
    </MainLayout>
  )
}

const MainLayout = styled.div`
  align-items: center; /* layout 1 */
  width: 100%;
  min-height: 100vh; /* layout 4 */
  //background-color: ${colorPalette.gray0};
`

const ContentWrapper = styled.main`
  margin-top: 100px;
  margin-bottom: 50px;
`
