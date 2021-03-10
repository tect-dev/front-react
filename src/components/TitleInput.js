import styled from 'styled-components'

import { colorPalette, fontSize } from '../lib/constants'

export const TitleInput = styled.input`
  all: unset;
  font-weight: bold;
  color: ${colorPalette.gray8};
  padding: 10px 0 20px 10px;
  size: 560;
  width: 100%;
  font-size: ${fontSize.large};
  &::placeholder {
    color: ${colorPalette.gray5};
  }
`
export const TitleBottomLine = styled.div`
  width: 90%;
  height: 0.5px;
  margin-left: 10px;
  margin-bottom: 14px;
  background: ${colorPalette.mainGreen};
  border-radius: 1px;
`
export const StyledTitle = styled.div`
  all: unset;
  font-weight: bold;
  color: ${colorPalette.gray8};
  padding: 10px 0 20px 10px;
  font-size: ${fontSize.large};
`
