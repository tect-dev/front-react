import { useState } from 'react'
import homeStyles from '../../styles/Home.module.css'
import { FaTimes } from 'react-icons/fa'

export default function SubjectBlockList({ children }) {
  const [showingDropdown, setShowingDropdown] = useState(false)
  return (
    <>
      <div className={homeStyles.dropdown}>
        <div
          className={homeStyles.dropbtn}
          onClick={() => {
            setShowingDropdown(!showingDropdown)
            console.log(showingDropdown)
          }}
        >
          {showingDropdown ? <FaTimes /> : 'more!'}
        </div>
        <div
          className={
            showingDropdown ? homeStyles.showDropdownContent : homeStyles.hiddenDropdownContent
          }
        >
          {children}
        </div>
      </div>
    </>
  )
}
