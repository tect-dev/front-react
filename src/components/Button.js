import React from 'react'
import '../styles/Button.css'
import { Link } from 'react-router-dom'

const STYLES = ['btn--primary', 'btn--outline']

const SIZES = ['btn--medium', 'btn--large']

export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonStyle : STYLES[0]

  return(
    <button
    className={`btn ${checkButtonStyle} ${checkButtonSize}`}
    onClick={onClick}
    type={type}
    >
    {children}
    </button>
  )
}