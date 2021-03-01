import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

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
  <input
    placeholder="Search..."
    value={searchValue}
    onKeyPress={(e) => {
      searchQuestions(e)
    }}
    onChange={(e) => {
      setSearchValue(e.target.value)
    }}
    style={{ display: 'block', marginBottom: "5px", width: "240px" }}
  />
  )
}
