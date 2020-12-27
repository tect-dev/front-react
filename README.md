### Some Convention

1. export default 는 사용하지 말고, 웬만해선 export const 로 사용할것. export default 는 import 하는 쪽에서 변수명이 달라질 수 있어서 혼동할 수가 있다.
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
