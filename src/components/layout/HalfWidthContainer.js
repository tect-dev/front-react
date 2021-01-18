import styled from 'styled-components'
import { mediaSize } from '../../lib/constants'

const HalfWidthContainer = styled.div`
  display: inline-flex;
  width: 41vw;
  padding-left: 4vw;
  padding-right: 4vw;
  padding-top: 20px;
  padding-bottom: 30px;
  overflow: scroll;
  height: 80vh;
  ${mediaSize.small} {
    overflow: auto;
    display: block;
    width: 85%;
  }
`

export default HalfWidthContainer
