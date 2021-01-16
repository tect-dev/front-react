import styled from 'styled-components'
import { mediaSize } from '../../lib/constants'

const HalfWidthContainer = styled.div`
  display: inline-flex;
  width: 42vw;
  padding-left: 4vw;
  padding-right: 4vw;
  padding-top: 20px;
  padding-bottom: 30px;
  overflow: scroll;
  height: 80vh;
  ${mediaSize.small} {
    width: 90vw;
    overflow: scroll;
    justify-content: space-around;
  }
`

export default HalfWidthContainer
