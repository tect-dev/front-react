import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { colorPalette, boxShadow } from '../lib/constants'

export const Search = () => {
  const [searchValue, setSearchValue] = useState('')

  const router = useHistory()
  const searchQuestions = (e) => {
    if (e.code === 'Enter' && searchValue !== '') {
      router.push({
        pathname: `/searched/${searchValue}?page=1`,
      })
    }
  }
  return (
    <StyledSearchInput
      placeholder="Search..."
      value={searchValue}
      type="search"
      onKeyPress={(e) => {
        searchQuestions(e)
      }}
      onChange={(e) => {
        setSearchValue(e.target.value)
      }}
    />
  )
}

const StyledSearchInput = styled.input`
  display: block;
  margin-bottom: 5px;
  margin-top: 5px;
  padding: 4px;
  padding-left: 12px;
  width: 240px;
  height: 24px;
  border: 0.2px solid ${colorPalette.gray3};
  border-radius: 5px;
  box-shadow: ${boxShadow.default};
  cursor: text;
  text-decoration: none solid #ffffff;
  &:focus {
    color: none;
  }
`
