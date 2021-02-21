import styled from 'styled-components'

import { colorPalette, fontSize } from '../lib/constants'

export const TitleInput = styled.input`
  all: unset;
  font-weight: bold;
  color: ${colorPalette.mainGreen};
  padding: 10px 0 20px 10px;
  width: 100%;
  font-size: ${fontSize.large};
  &::placeholder {
    color: ${colorPalette.mainGreen};
  }
`
export const TitleBottomLine = styled.div`
  width: 90%;
  height: 3px;
  margin-left: 10px;
  margin-bottom: 14px;
  background: ${colorPalette.mainGreen};
  border-radius: 1.5px;
`
export const StyledTitle = styled.div`
  all: unset;
  font-weight: bold;
  color: ${colorPalette.mainGreen};
  padding: 10px 0 20px 10px;
  font-size: ${fontSize.large};
`
