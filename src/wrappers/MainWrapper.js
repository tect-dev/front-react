import styled from 'styled-components'
import Navbar, { NavbarInTheHomePage } from '../components/layout/Navbar'
import {
  Container,
  Button,
  Link,
  lightColors,
  darkColors,
} from 'react-floating-action-button'

import { colorPalette } from '../lib/constants'
import { useDispatch, useSelector } from 'react-redux'
import { createTechtree } from '../redux/techtree'
import { authService } from '../lib/firebase'

const buttonPraise1 = 'Plant tree'
const buttonPraise2 =
  'To Plant tree, email verification is required! please check your email.'
const buttonPraise3 = 'My Forest'
const buttonPraise4 = 'To get to your own forest, login is required!'

export default function MainWrapperDefault({ children }) {
  const dispatch = useDispatch()
  const { loginState, userID, emailVerified, userInfo } = useSelector(
    (state) => {
      return {
        loginState: state.auth.loginState,
        userID: state.auth.userID,
        emailVerified: state.auth.emailVerified,

        userInfo: {
          firebaseUid: state.auth.userID,
          displayName: state.auth.userNickname,
        },
      }
    }
  )
  return (
    <MainLayout>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
      <Container>
        {loginState && authService.currentUser.emailVerified ? (
          <Button
            tooltip={buttonPraise1}
            icon="fas fa-plus"
            style={{ curosr: 'pointer' }}
            onClick={() => {
              dispatch(createTechtree(userInfo))
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
            tooltip={buttonPraise2}
          ></Button>
        )}

        {loginState ? (
          <Link
            tooltip={buttonPraise3}
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
            tooltip={buttonPraise4}
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
  return (
    <MainLayout>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
    </MainLayout>
  )
}

export const MainWrapperInTheHomePage = ({ children }) => {
  const dispatch = useDispatch()
  const { loginState, userID, emailVerified, userInfo } = useSelector(
    (state) => {
      return {
        loginState: state.auth.loginState,
        userID: state.auth.userID,
        emailVerified: state.auth.emailVerified,
        userInfo: {
          firebaseUid: state.auth.userID,
          displayName: state.auth.userNickname,
        },
      }
    }
  )
  return (
    <MainLayout>
      <NavbarInTheHomePage />
      <ContentWrapper>{children}</ContentWrapper>
      <Container>
        {loginState && authService.currentUser.emailVerified ? (
          <Button
            tooltip={buttonPraise1}
            icon="fas fa-plus"
            style={{ curosr: 'pointer' }}
            onClick={() => {
              dispatch(createTechtree(userInfo))
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
            tooltip={buttonPraise2}
          ></Button>
        )}
        {loginState ? (
          <Link
            tooltip={buttonPraise3}
            icon="fa fa-plus"
            rotate={true}
            href={`/forest/${userID}`}
          />
        ) : (
          <Button tooltip={buttonPraise4}></Button>
        )}
      </Container>
    </MainLayout>
  )
}
