import React from 'react'
import '../styles/Button.scss'

import { fontSize, colorPalette } from '../lib/constants'
import styled from 'styled-components'

export const DefaultButton = styled.button`
  font-size: ${fontSize.xsmall};
  padding: 6px 8px;
  margin: 2px;
  border: 1px solid ${colorPalette.mainGreen};
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  background-color: #fff;

  &:hover {
    background: ${colorPalette.mainGreen};
    color: white;
  }
`

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
  style,
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[1]
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonStyle : SIZES[0]

  return (
    <button
      className={`${className} ${checkButtonStyle} ${checkButtonSize}`}
      type={htmlType}
      onClick={onClick}
      id={id}
      style={style}
    >
      {children}
    </button>
  )
}
