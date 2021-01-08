import React from 'react'
import '../styles/Button.scss'

const STYLES = ['btn--primary', 'btn--outline']
const SIZES = ['btn--medium', 'btn--large'] 

export const Button = ({
  className,
  children,
  buttonSize,
  buttonStyle,
  linkTo,
  htmlHref,
  htmlType,
  onClick
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[1]
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonStyle : SIZES[0]

  return (
    <button className={`${className} ${checkButtonStyle} ${checkButtonSize}`} 
            type={htmlType}
            onClick={onClick}>{children}</button>
  )
}