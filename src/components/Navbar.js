import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const user = null;
  return (
    <>
      <Link to="/">Tect.dev </Link>
      <Link to="/question">QnA </Link>
      <Link to="/about">About </Link>
      {user ? (
        <Link to="/about">MyPage </Link>
      ) : (
        <Link to="/login">Login </Link>
      )}
    </>
  );
}
