import styled from 'styled-components'
import Navbar, { NavbarInTheHomePage } from '../components/layout/Navbar'
import {
  Container,
  Button,
  Link,
  lightColors,
  darkColors,
} from 'react-floating-action-button'
import {
  FaTimes,
  FaBars,
  FaSearch,
  FaUserAlt,
  FaQuestion,
} from 'react-icons/fa'

import { colorPalette } from '../lib/constants'
import { useDispatch, useSelector } from 'react-redux'
import { createTechtree } from '../redux/techtree'
import { pointer } from 'd3'

export default function MainWrapperDefault({ children }) {
  const dispatch = useDispatch()
  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
  return (
    <MainLayout>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
      <Container>
        {loginState ? (
          <Button
            tooltip="나무 심기"
            icon="fas fa-plus"
            style={{ curosr: 'pointer' }}
            onClick={() => {
              dispatch(createTechtree())
            }}
            styles={{
              backgroundColor: colorPalette.teal5,
              color: lightColors.white,
              curosr: 'pointer',
            }}
          />
        ) : (
          <Button
            styles={{
              backgroundColor: colorPalette.teal5,
              color: lightColors.white,
            }}
            icon="fas fa-plus"
            tooltip="나무를 심으려면 로그인이 필요해요!"
          ></Button>
        )}

        {loginState ? (
          <Link
            tooltip="내 숲으로 가기"
            icon="fas fa-tree"
            //rotate={true}
            href={`/forest/${userID}`}
            styles={{
              backgroundColor: colorPalette.teal5,
              color: lightColors.white,
            }}
          />
        ) : (
          <Button
            tooltip="내 숲으로 가려면 로그인이 필요해요!"
            icon="fas fa-tree"
            styles={{
              backgroundColor: colorPalette.teal5,
              color: lightColors.white,
            }}
          ></Button>
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

export const ContentWrapper = styled.main`
  margin-top: 100px;
  margin-bottom: 50px;
  margin-left: 20vw;
  margin-right: 20vw;
  @media (max-width: 1920px) {
    margin-left: 15vw;
    margin-right: 15vw;
  }
  @media (max-width: 1440px) {
    margin-left: 10vw;
    margin-right: 10vw;
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
  const dispatch = useDispatch()
  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
  return (
    <MainLayout>
      <NavbarInTheHomePage />
      <ContentWrapper>{children}</ContentWrapper>
      <Container>
        <Button
          tooltip="나무 심기"
          icon="fa fa-sticky-note"
          onClick={() => {
            dispatch(createTechtree())
          }}
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
