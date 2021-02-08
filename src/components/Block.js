import { colorPalette, boxShadow, hoverAction } from '../lib/constants'
import styled from 'styled-components'

export const TechtreeThumbnailBlock = styled.div`
  padding: 1rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  h4 {
    font-size: 1rem;
    margin: 0;
    margin-bottom: 0.25rem;
    line-height: 1.5;
    word-break: break-word;
    color: ${colorPalette.gray9};
  }
  .description-wrapper {
    flex: 1;
  }
  svg {
    object-fit: cover;
  }
`

export const TechtreeInfo = styled.div`
  padding: 0.625rem 1rem;
  border-top: 1px solid ${colorPalette.gray0};
  display: flex;
  font-size: 0.75rem;
  line-height: 1.5;
  justify-content: space-between;
`

export const TechtreeThumbnailCard = styled.div`
  border-radius: 2px;
  //width: 20rem;
  //height: '300px';
  box-shadow: ${boxShadow.default};
  place-items: center;
  background-color: #ffffff;
  margin: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
