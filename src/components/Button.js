import React from 'react'
import '../styles/Button.scss'

export const Button = ({
  className,
  children,
  linkTo,
  htmlHref,
  htmlType
}) => {
  return (
    <button className={className} type={htmlType}>{children}</button>
  )
}