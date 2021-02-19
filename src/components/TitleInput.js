import styled from 'styled-components'

import { fontSize } from '../lib/constants'

export const TitleInput = styled.input`
  all: unset;
  font-weight: bold;
  color: #6d9b7b;
  padding: 10px 0 20px 10px;
  width: 90%;
  font-size: ${fontSize.large};
  &::placeholder {
    color: #6d9b7b;
  }
`
export const TitleBottomLine = styled.div`
  width: 90%;
  height: 3px;
  margin-left: 10px;
  margin-bottom: 14px;
  background: #6d9b7b;
  border-radius: 1.5px;
`
export const StyledTitle = styled.div`
  all: unset;
  font-weight: bold;
  color: #6d9b7b;
  padding: 10px 0 20px 10px;
  font-size: ${fontSize.large};
`
