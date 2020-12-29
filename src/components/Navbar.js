import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginSuccess } from '../redux/auth';

export default function Navbar() {
  // useSelector: 리덕스 스토어의 상태를 조회하는 hooks.
  // state 의 값은 리덕스 스토에다가 getState() 를 호출했을때 나오는 값과 같음.
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.user };
  });

  // useDispatch : 리덕스 스토어의 dispatch 를 함수에서 쓸 수 있게 해주는 hooks.
  const dispatch = useDispatch();

  // useCallback : 함수의 불필요한 리렌더링을 막기 위한 hooks.
  // react 는 컴포넌트가 리렌더링되면 함수도 새로 생기는데, 반복적으로 사용하는 함수를 리렌더링 하지 않고 재사용하기 위함.
  const onLogin = useCallback(() => {
    dispatch(loginSuccess());
  }, [dispatch]);

  return (
    <>
      <nav>
        <Link to="/">Tect.dev </Link>
        <Link to="/question">QnA </Link>
        <Link to="/about">About </Link>
        {loginState ? (
          <Link to={`/user/`}>MyPage </Link>
        ) : (
          <Link to="/login">Login </Link>
        )}
        <button
          onClick={() => {
            onLogin();
          }}
        >
          로그인상태 변경(임시)
        </button>
      </nav>
    </>
  );
}
