import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
      <Link to="/">Tect.dev</Link>
      <Link to="/about">about</Link>
    </>
  );
}
