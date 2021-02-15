import styled from 'styled-components'

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 25px;
  align-items: center; // 세로축에서 중앙정렬
  justify-items: center; // 가로축에서 중앙정렬

  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`
