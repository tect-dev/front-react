import styled from 'styled-components'
import Navbar, { NavbarInTheHomePage } from '../components/layout/Navbar'
import { Container, Button, Link } from 'react-floating-action-button'

import { colorPalette } from '../lib/constants'
import { useSelector } from 'react-redux'

export default function MainWrapperDefault({ children }) {
  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
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
        {loginState ? (
          <Link
            tooltip="내 숲으로 가기"
            icon="fa fa-plus"
            rotate={true}
            href={`/forest/${userID}`}
          />
        ) : (
          <Button tooltip="로그인이 필요해요!"></Button>
        )}
      </Container>
    </MainLayout>
  )
}

const MainLayout = styled.div`
  align-items: center; /* layout 1 */

  width: 100%;
  //min-height: 100vh; /* layout 4 */
  //background-color: ${colorPalette.gray0};
`

const ContentWrapper = styled.main`
  margin-top: 100px;
  margin-bottom: 50px;
  margin-left: 20vw;
  margin-right: 20vw;
  @media (max-width: 1440px) {
    margin-left: 15vw;
    margin-right: 15vw;
  }
  @media (max-width: 1024px) {
    margin-left: 10vw;
    margin-right: 10vw;
  }
  @media (max-width: 650px) {
    margin-left: 5vw;
    margin-right: 5vw;
  }
`

export const MainWrapperWithoutFAB = ({ children }) => {
  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
  return (
    <MainLayout>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
    </MainLayout>
  )
}

export const MainWrapperInTheHomePage = ({ children }) => {
  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
  return (
    <MainLayout>
      <NavbarInTheHomePage />
      <ContentWrapper>{children}</ContentWrapper>
      <Container>
        <Link href="/" tooltip="나무 심기" icon="fa fa-sticky-note" />
        <Link
          href="/"
          tooltip="뭘 넣는게 좋을까 여기엔"
          icon="fa fa-user-plus"
        />
        {loginState ? (
          <Link
            tooltip="내 숲으로 가기"
            icon="fa fa-plus"
            rotate={true}
            href={`/forest/${userID}`}
          />
        ) : (
          <Button tooltip="로그인이 필요해요!"></Button>
        )}
      </Container>
    </MainLayout>
  )
}
