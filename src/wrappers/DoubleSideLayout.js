import styled from 'styled-components'

export default function ({ children }) {
  return <DoubleSideLayout>{children}</DoubleSideLayout>
}

const DoubleSideLayout = styled.div`
  display: grid;
  justify-items: center; // 가로축에서 중앙정렬
  grid-gap: 40px;

  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
