### 프로젝트 폴더설명

- root : .env나 .prettierrc 같은 설정파일들이 위치
- src : react 코드들
- src/pages : 특정 url에 매칭되는 리액트 페이지들
- src/components/[PAGENAME] : 특정 페이지에서만 쓰이는 리액트 컴포넌트들은 따로 폴더를 만들어준다. 앱 전체 레이아웃이나 네비게이션 바같은건 src/components 에 위치함.
- lib : 개발용 더미데이터나 구글 아날리틱스용 파일(gtag.js) 처럼, view 와 상관없는 것들이 모여있는 폴더
- assets : 이미지나 아이콘처럼 정적인 파일들(static files)를 모아둔 폴더.

### Some Convention

1. export default 는 사용하지 말고, 웬만해선 export const 로 사용할것. export default 는 import 하는 쪽에서 변수명이 달라질 수 있어서 혼동할 수가 있다. React 컴포넌트만 export default 하고, 일반 함수는 export const 를 쓰자.

2. var는 쓰지 말고 웬만해선 let과 const 를 사용. var 는 호이스팅 등으로 버그를 유발하기 쉽다.
3. 인자로 들어가는 함수는 가독성을 위해 화살표 함수 ()=>{} 를 권장.

```
// bad
[1, 2, 3].map(function (x) {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});
```

4. 긴 문자열이 변수와 결합될때는 + 대신 \`\` 을 사용.

```
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// bad
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

// bad
function sayHi(name) {
  return `How are you, ${ name }?`;
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```
