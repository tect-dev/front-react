import MainLayout from "./MainLayout"
import styled from 'styled-components'

const ErrorPage = ({ children }) => {
  return (
    <MainLayout>
      <ErrorContainer>
        <div>
          {children}
        </div>
      </ErrorContainer>
    </MainLayout>
  )
}

export default ErrorPage

export const ErrorContainer = styled.div`
  display: grid;
  // 임시로 하드 코딩
  height: calc(100vh - 100px);
  place-items: center;
`