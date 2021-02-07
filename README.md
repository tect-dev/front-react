### 프로젝트 폴더설명

- root : .env나 .prettierrc 같은 설정파일들이 위치
- src : react 코드들
- src/pages : 특정 url에 매칭되는 리액트 페이지들
- src/components/[PAGENAME] : 특정 페이지에서만 쓰이는 리액트 컴포넌트들은 따로 폴더를 만들어준다. 앱 전체 레이아웃이나 네비게이션 바같은건 src/components 에 위치함.
- src/lib : 개발용 더미데이터나 구글 아날리틱스용 파일(gtag.js), 자주 사용되는 함수들(functions.js), 스타일 및 반복사용되는 상수들(constants) 처럼, view 와 상관없는 것들이 모여있는 폴더
- src/redux : redux 와 관련된 파일들. index.js 는 루트리듀서이고, 나머지는 서브리듀서이다. 액션과 리듀서를 다른 파일로 분리하지 않고, 하나의 파일을 사용하는 ducks 패턴을 따른다.
- src/hooks : useInput 처럼 반복적으로 사용되는 hooks 를 모아둔다.
- src/styles : 디자인용 css 파일들.
- 이미지나 아이콘같은 정적 파일들은 /src/assets 폴더에 집어넣고, 리액트 파일내에서 import 해서 사용한다.

### Code Convention

1. React 컴포넌트는 export default를, 그외의 경우에는 모두 export const 를 사용. export default 를 사용하면 export한곳에서의 이름과 import 한곳에서의 이름이 달라질 수 있어, 혼동이 생길수 있다.
2. var는 쓰지 말고 웬만해선 let과 const 를 사용. var 는 호이스팅 등으로 버그를 유발하기 쉽다.
3. 인자로 들어가는 함수는 가독성을 위해 화살표 함수 ()=>{} 사용을 권장.

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

4. 문자열끼리 결합할때는 + 대신 \`\` 을 사용.

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

5. 서로 같은지를 체크할때는 ==, != 대신 ===,!== 를 사용할 것. ==는 왼쪽과 오른쪽의 타입이 다른데도 같다고 판정할 때가 있다. (0 == "0" -> true)
