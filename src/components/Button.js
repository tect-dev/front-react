import React from 'react'
import '../styles/Button.scss'

const STYLES = ['btn--primary', 'btn--outline']
const SIZES = ['btn--medium', 'btn--large'] 

export const Button = ({
  id,
  className,
  children,
  buttonSize,
  buttonStyle,
  linkTo,
  htmlHref,
  htmlType,
  onClick,
  style
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[1]
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonStyle : SIZES[0]

  return (
    <button className={`${className} ${checkButtonStyle} ${checkButtonSize}`} 
            type={htmlType}
            onClick={onClick}
            id={id}
            style={style}
            >{children}
    </button>
  )
}