import styled from 'styled-components'
import { mediaSize } from '../../lib/constants'

const HalfWidthContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  /* box-sizing: border-box; */
  margin-top: 20px;
  padding-bottom: 30px;
  overflow: auto;
  width: 100%; /* 필수 */
  height: 80vh;
  ${mediaSize.small} {
    display: block;
    padding: 0;
    height: initial;
    max-height: 80vh;
  }
`

export default HalfWidthContainer
