# frontend-survival-week01

프론트엔드 생존코스 1주차 과제

## 목표

1. 프론트엔드 개발 환경 설정 방법 작성(React + TypeScript + Parcel)
2. 의존성 설치 및 설정파일 모두 생성, 작성

Node.js를 설치하고, 프로젝트를 진행할 수 있는 Node.js 패키지를 만들고,
코드 퀄리티를 일정 수준 이상으로 유지할 수 있도록 `lint`와 `test`를
실행할 수 있는 상태를 만든다.

## Node 환경을 위한 사전 준비

### Homebrew 설치(WSL)

[Homebrew](https://brew.sh/)를 이용해
`fnm`을 설치할 수 있다.

WSL의 경우 [리눅스에서의 설치](https://docs.brew.sh/Homebrew-on-Linux) 를 참고한다.

#### homebrew 설치 커맨드

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

```bash
test -d ~/.linuxbrew && eval "$(~/.linuxbrew/bin/brew shellenv)"
test -d /home/linuxbrew/.linuxbrew \\
&& eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
test -r ~/.bash_profile \\
&& echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >> ~/.bash_profile
```

```bash
# ~/.profile on Debian/Ubuntu
echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >> ~/.profile

# ~/.bash_profile on CentOS/Fedora/Red Hat.
echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >> ~/.bash_profile
```

#### 설치 후 brew Package manager의 정상 동작 여부 확인

```bash
brew install hello
```

#### 개발도구 설치

```bash
# Debian or Ubuntu
sudo apt-get install build-essential procps curl file git

#Fedora, CentOS, or Red Hat
sudo yum groupinstall 'Development Tools'
sudo yum install procps-ng curl file git```
```

### fnm (Fast Node Manager) 설치

계속 업그레이드되는 Node.js로 프로젝트를 진행하다 보면
프로젝트마다 서로 다른 버전을 사용하는 경우가 있다.
그래서 여러 버전의 Node.js를 설치해서 사용하고 싶을 때가 있는데,
[`fnm`](https://github.com/Schniz/fnm)을
사용하면 이게 가능하다.

brew를 설치한 후에 fnm을 설치한다.

```bash
brew install fnm
```

`~/.bashrc` 또는 `~/.zshrc`에 다음을 추가한다.

```bash
eval "$(fnm env)"
```

혹은 `eval "$(fnm env --use-on-cd)"`을 bash 상에 입력해도 된다.

현재 터미널에서 바로 사용하고 싶다면 위 명령을 그대로 입력한다.

### fnm - Node.js 설치

fnm(fast node manager)을 통해 Node.js를 설치 한다. 프로젝트 별로 노드 버전이 다를 경우 관리하기 용이하다.
설치 가능한 버전 확인.

```bash
fnm ls-remote
```

LTS(Long Term Support) 버전을 설치하고 기본으로 사용하게 한다.

```bash
fnm install --lts
fnm use lts-latest
fnm default $(fnm current)
```

#### 설치된 상태 확인

```bash
fnm list

fnm current
```

### NPM 업그레이드

```bash
npm install -g npm
```

### 프로젝트 폴더 생성

프로젝트 이름을 `my-project`라고 했을 때 다음과 같이 폴더를 만들고
사용할 Node.js 버전을 잡아준다.

```bash
mkdir my-project
cd my-project
fnm use default
echo "$(fnm current)" > .nvmrc
```

나중에 시스템에 설치된 Node.js 버전과 프로젝트에서 사용하는 Node.js 버전이
다른 상황이 오더라도 `fnm use` 명령을 통해 프로젝트에서 사용하고 있는 버전을
쉽게 사용할 수 있다.

또는 `.nvmrc` 파일을 확인함으로써 어떤 버전으로 개발했는지 알 수 있다.

```bash
cat .nvmrc
```

## 프로젝트 초기화

다음 명령을 실행하고 질문에 답함으로써 `package.json` 파일을 자동으로 생성한다.

```bash
mkdir <project-folder>
cd <project-folder>
npm init -y # 질문 없이 생성

```

## .gitignore 생성

`node_modules`의 경우 node js 모듈들을 모두 담고 있다.

모듈들은 용량이 커서 git 용량 제한에 걸리고 올려서도 안된다.

프로젝트 생성 시에 미리미리 gitignore를 설정해둬야 commit시 어려움이 없다.

참고

[github gitignore node](https://github.com/github/gitignore/blob/main/Node.gitignore)

```bash
vim .gitignore # 최소한 node_modules/ 추가
```

## Git SSH 설정

git 이메일 주소를 통해 key를 생성한다.

```bash
ssh-keygen -t ed25519 -C "<<GIT EMAIL 주소>>"
```

`~/.profile` 또는 `~/.bashrc` 파일에 붙여넣기.

```bash
env=~/.ssh/agent.env

agent_load_env () { test -f "$env" && . "$env" >| /dev/null ; }

agent_start () {
    (umask 077; ssh-agent >| "$env")
    . "$env" >| /dev/null ; }

agent_load_env

# agent_run_state: 0=agent running w/ key; 1=agent w/o key; 2=agent not running
agent_run_state=$(ssh-add -l >| /dev/null 2>&1; echo $?)

if [ ! "$SSH_AUTH_SOCK" ] || [ $agent_run_state = 2 ]; then
    agent_start
    ssh-add
elif [ "$SSH_AUTH_SOCK" ] && [ $agent_run_state = 1 ]; then
    ssh-add
fi

unset env
```

ssh-agent 수동 시작

```bash
eval "$(ssh-agent -s)"
```

ssh-agent에 SSH private key 추가

```bash
ssh-add ~/.ssh/id_ed25519
```

SSH public key 복사

```bash
$ clip < ~/.ssh/id_ed25519.pub
  # Copies the contents of the id_ed25519.pub file to your clipboard
# 혹시 WSL 환경에서 clip 이 동작안한다면 clip 대신 clip.exe 를 넣어보자
```

GitHub에 ssh key 등록

```text
우상단 Profile 그림 클릭 -> Settings -> 좌측 Access menu의 SSH and GPG Keys 
-> New SSH Key -> key에 clipboard 붙여넣기 및 title 지정 
```

## TypeScript 설정

### typescript 설치

개발에서만 사용되는 TypeScript의 경우 -D 옵션을 붙여서 설치한다.

```bash
npm i -D typescript # npm install --save-dev typescript
```

설치하면 package.json의 개발 의존성 항목에 추가된다. 개발 도구로 보면 된다
배포시 뺄 경우 프로젝트를 경량화 할 수 있다.

```json
  "devDependencies": {
    "typescript": "^5.0.4"
  }
```

typescript compiler 초기화

```bash
npx tsc --init
```

tsconfig.json 내용 변경

`"jsx": "react-jsx",` 주석 해제

## ESLint 설치

좋은 코딩 스타일을 위해 [ESLint](https://eslint.org/)를 설치해 사용한다.

```bash
npm i -D eslint # npm install --save-dev eslint
```

다음 명령을 통해 ESLint 설정 파일(`.eslintrc.js`)을 자동으로 생성한다.

```bash
npx eslint --init
```

eslint project 설정

```text
You can also run this command directly using 'npm init @eslint/config'.
? How would you like to use ESLint? …
  To check syntax only
  To check syntax and find problems
▸ To check syntax, find problems, and enforce code style

✔ How would you like to use ESLint? · style

? What type of modules does your project use? …
▸ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these

✔ What type of modules does your project use? · esm

? Which framework does your project use? …
▸ React
  Vue.js
  None of these

✔ Which framework does your project use? · react

? Does your project use TypeScript? ‣ No / Yes

✔ Does your project use TypeScript? · No / Yes

? Where does your code run? … \\
(Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser
✔ Node

? Where does your code run? \\
(Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser
✔ Node

✔ Where does your code run? · browser

? How would you like to define a style for your project? …
▸ Use a popular style guide
  Answer questions about your style

✔ How would you like to define a style for your project? · guide

? Which style guide do you want to follow? …
  Standard: https://github.com/standard/eslint-config-standard-with-typescript
▸ XO: https://github.com/xojs/eslint-config-xo-typescript

✔ Which style guide do you want to follow? · xo-typescript

? What format do you want your config file to be in? …
▸ JavaScript
  YAML
  JSON

✔ What format do you want your config file to be in? · JavaScript

Checking peerDependencies of eslint-config-xo-typescript@latest
Checking peerDependencies of eslint-config-xo@latest
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest eslint-config-xo@latest eslint@>=8.0.0 \\
eslint-config-xo-typescript@latest @typescript-eslint/eslint-plugin@>=5.57.0 \\
@typescript-eslint/parser@>=5.57.0 typescript@>=4.4

? Would you like to install them now? ‣ No / Yes

✔ Would you like to install them now? · Yes

? Which package manager do you want to use? …
▸ npm
  yarn
  pnpm

✔ Which package manager do you want to use? · npm

Installing eslint-plugin-react@latest, eslint-config-xo@latest, \\
eslint@>=8.0.0, eslint-config-xo-typescript@latest, \\
@typescript-eslint/eslint-plugin@>=5.57.0, @typescript-eslint/parser@>=5.57.0, \\
typescript@>=4.4

added 103 packages, and audited 205 packages in 13s

87 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Successfully created .eslintrc.js file in /home/~~~

```

`.eslintrc.js` 파일을 열어 `rules`를 수정, 추가한다.
[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) 같은
널리 알려진 스타일 가이드를 사용하고 싶다면 간단히
[eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
확장을 설치해서 사용하면 된다.

`.eslintrc.js` 파일에 `env : { jest : true }` 속성을 추가시켜 준다.

### .eslintignore 추가하기

상황에 따라 유동적으로 추가하지만 밑의 3은 기본

```bash
# vim .eslintignore
/node_modules/
/dist/
/.parcel-cache/
```

#### .eslintrc rules 강의 예시

```javascript
    // 공백 4칸에서 공백 2칸으로 변경.
    // https://eslint.org/docs/rules/indent
    'indent': ['error', 2],

    // 줄 끝 공백 항상 제거.
    // https://eslint.org/docs/rules/no-trailing-spaces
    'no-trailing-spaces': 'error',

    // 블록 중괄호 항상 사용.
    // https://eslint.org/docs/rules/curly
    'curly': 'error',

    // 중괄호 스타일 맞춤.
    // https://eslint.org/docs/rules/brace-style
    'brace-style': 'error',

    // 공백이 필요하면 하나만 들어게 한다.
    // https://eslint.org/docs/rules/no-multi-spaces
    'no-multi-spaces': 'error',

    // 연산자 앞뒤에 공백이 들어가게 한다.
    // https://eslint.org/docs/rules/space-infix-ops
    'space-infix-ops': 'error',

    // 단항 연산자가 단어면 사이에 공백이 들어가게 하고, 기호면 공백을 제거.
    // https://eslint.org/docs/rules/space-unary-ops
    'space-unary-ops': 'error',

    // 속성 앞 공백 제거.
    // https://eslint.org/docs/rules/no-whitespace-before-property
    'no-whitespace-before-property': 'error',

    // 함수 호출을 위한 소괄호는 반드시 붙여서 쓰게 한다.
    // https://eslint.org/docs/rules/func-call-spacing
    'func-call-spacing': 'error',

    // 블록 앞에 공백이 들어가게 한다.
    // https://eslint.org/docs/rules/space-before-blocks
    'space-before-blocks': 'error',

    // if, else 등 키워드 앞뒤에 공백이 들어가게 한다.
    // https://eslint.org/docs/rules/keyword-spacing
    'keyword-spacing': ['error', { 'before': true, 'after': true }],

    // 쉼표 뒤에만 공백이 들어가게 한다.
    // https://eslint.org/docs/rules/comma-spacing
    'comma-spacing': ['error', { 'before': false, 'after': true }],

    // 여러 줄로 여러 요소를 표현할 때 줄 마지막에 쉼표가 들어가게 한다.
    // https://eslint.org/docs/rules/comma-style
    'comma-style': ['error', 'last'],

    // 여러 줄로 여러 요소를 표현할 때 마지막 줄 끝에도 쉼표가 들어가게 한다.
    // https://eslint.org/docs/rules/comma-dangle
    'comma-dangle': ['error', 'always-multiline'],

    // 소괄호 안에 공백이 들어가지 않게 한다.
    // https://eslint.org/docs/rules/space-in-parens
    'space-in-parens': ['error', 'never'],

    // 블록 중괄호 안에 공백이 들어가게 한다.
    // https://eslint.org/docs/rules/block-spacing
    'block-spacing': 'error',

    // Array 리터럴 대괄호 안에 공백이 들어가지 않게 한다.
    // https://eslint.org/docs/rules/array-bracket-spacing
    'array-bracket-spacing': ['error', 'never'],

    // Object 리터럴 중괄호 안에 공백이 들어가게 한다.
    // https://eslint.org/docs/rules/object-curly-spacing
    'object-curly-spacing': ['error', 'always'],

    // Key-Value 구분을 위한 콜론 뒤에만 공백을 넣는다.
    // https://eslint.org/docs/rules/key-spacing
    'key-spacing': ['error', { 'mode': 'strict' }],

    // Arrow Function 기호 앞 뒤에 공백이 들어가게 한다.
    // https://eslint.org/docs/rules/arrow-spacing
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
```

`.eslintrc.js` 파일 자체를 ESLint 설정에 맞추고 싶다면 다음을 실행한다.

```bash
npx eslint --fix --no-ignore .eslintrc.js
```

이 설정 파일은 [Visual Studio Code](https://code.visualstudio.com/)나
[WebStorm](https://www.jetbrains.com/webstorm/) 등에서 사용할 수 있다.

고쳐야 할 부분을 찾는다.

```bash
npx eslint .
```

다음 명령을 실행하면 코드를 검사하고 자동으로 고칠 수 있는 부분을 고쳐주고,
그래도 남아있는 문제는 화면에 보여준다.

```bash
npx eslint --fix .
```

`package.json`의 `scripts` 항목에 `lint`를 추가하면 이 작업을 편하게 할 수 있다.

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint --fix .  # <- 여기에 lint 명령을 추가"
  },
```

`npm run`으로 ESLint를 실행할 수 있다.

```bash
npm run lint
```

### eslint extension 추가 설정

[eslint vscode extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

settings.json 만들기

```bash
mkdir .vscode/
vim ./.vscode/settings.json
```

```json
# settings.json - eslint 포함 모든 것에 대해 저장 시 수정
{
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    }
}
```

```json
# settings.json - eslint에 대해서만 저장 시 수정
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

추가 참고 설정

* [VS Code 기본 세팅](https://github.com/ahastudio/CodingLife/blob/main/20211008/react/.vscode/settings.json)
* [끝에 붙는 공백 지우기](https://marketplace.visualstudio.com/items?itemName=shardulm94.trailing-spaces)

나의 설정

```json
{
//     "editor.codeActionsOnSave": {
//         "source.fixAll.eslint": true
//     }
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },
    "editor.rulers": [
        80
    ],
    "trailing-spaces.trimOnSave": true
}

```

## React 설치

설치시에는 `package.json`을 건들지 않는다.

```bash
npm i react react-dom
```

```json
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
```

위 react, react-dom에 대응하는 typescript 관련 도구 설치

```bash
npm i -D @types/react @types/react-dom
```

## Jest & testing 도구 설치

Speedy Web Compiler - rust로 만들어진 js 빌드툴(번들링, 컴파일)

jest, swc를 같이 쓰기위해 설치한다

```bash
npm i -D jest @types/jest @swc/core @swc/jest jest-environment-jsdom \\
@testing-library/react @testing-library/jest-dom
```

설치 후 jest.config.js 파일을 작성해서 테스트 상에서 SWC 사용하기

* [jest.config.js예시](https://github.com/ahastudio/CodingLife/blob/main/20220726/react/jest.config.js)
* lint 검사 후 바로 fix - `npx eslint --fix .`

## Parcel 설치

```bash
npm i -D parcel
```

## scripts 추가

`package.json` 의 `scripts` 부분 추가 예시 - [링크](https://github.com/ahastudio/CodingLife/blob/main/20220726/react/package.json)

```json
  "scripts": {
    "start": "parcel --port 8080",
    "build": "parcel build",
    "check": "tsc --noEmit",
    "lint": "eslint --fix --ext .js,.jsx,.ts,.tsx .",
    "test": "jest",
    "coverage": "jest --coverage --coverage-reporters html",
    "watch:test": "jest --watchAll"
  },
```

파일 없이 빌드 하고 스크립트 수행하면  Could not find entry 에러가 뜬다.

index.html 을 만들어 준 다음 source 추가

```bash
vim index.html
```

```html
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="UTF-8"/>
        <title>React Test App</title>
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="./src/main.tsx"></script>
    </body>
</html>
```

```json
"source": "index.html", # package.json main 위에 추가
```

`./src/main.tsx` 추가

```javascript

import ReactDOM from 'react-dom/client';

function App() {
  return (
    <p>Hello, World!</p>
  );
}

const element = document.getElementById('root');

if (element) {
  const root = ReactDOM.createRoot(element);

  root.render(<App/>);
}

```

`.eslintrc` 에 `jsx-runtime` 추가

```json
extends: [
  'plugin:react/recommended',
  'plugin:react/jsx-runtime', // 이부분 추가
  'xo',
],
```

이후 `npm start` 하면 test page 배포됨

## Typescript

REPL을 위한 ts-node 설치

```bash
npx ts-node
```

## Jest 설치

자동화된 테스트 코드를 작성하고 활용하기 위해 Jest를 설치해서 쓸 수 있다.

```bash
npm install --save-dev jest
```

`main.test.js` 파일을 만들어서 확인해 보자.

TDD는 테스트 먼저 만들고 테스트에 맞는 내용을 구현하는 방식

기본적인 테스트 코드이다

```javascript
test('add', () => {
  expect(add(1, 2)).toBe(3);
});
```

BDD(behavior driven development) 스타일의 코드이다

describe - context - it

```javascript
describe('describe - it - expect : add 함수는', () => {
    context('두 개의 양수가 주어졌을 때',()=>{
        it('두 숫자의 합을 돌려준다', () => {
            expect(add(1, 2)).toBe(3);
        });
    });
});

```

`jest`를 실행하면 `*.test.js` 파일을 모두 실행한다.

```bash
npx jest
```

`--watchAll` flag를 통해 수정 될 때마다 jest test

```bash
npx jest --watchAll # script 에서는 npm watch:test
```

`--verbose` flag로 더 자세한 정보를 볼 수 있음

```bash
npm jest --verbose
```

추가적인 설정시 `jest.config.js` 파일 수정
<https://jestjs.io/docs/en/configuration> 문서 참고.

```javascript
module.exports = {
  verbose: true,
};
```

ESLint를 실행하면 `test`나 `expect` 같은 게 정의되지 않았다는 에러가 뜨는데,
`.eslintrc.js` 파일의 `env`에 `jest`를 추가하면 된다.

```javascript
  'env': {
    'es6': true,
    'node': true,
    // Jest 사용
    'jest': true,
  },
```

마찬가지로 `package.json`을 수정해서 `npm`으로 테스트를 실행할 수 있다.

```json
  "scripts": {
    "test": "jest  # <- 기존의 에러 종료를 Jest 실행으로 변경",
    "lint": "eslint --fix ."
  },
```

`test`는 기본 명령이라 `run` 없이 실행 가능하다.

```bash
npm test
```

## Parcel 사용

package.json에 source 추가 없이 사용

```bash
npx parcel index.html --port 8080
```

package.json에 source 추가 및 사용

```bash
npx parcel --port 8080
```

### 이미지 포함 빌드

image 삽입 html

```html
<img src='/images/test.jpg' alt='Test Image'/>
```

정적 파일 처리해주는 parcel plugin [parcel-reporter-static-files-copy](https://github.com/elwin013/parcel-reporter-static-files-copy)설치

```bash
npm i -D parcel-reporter-static-files-copy
```

plugin `.parcelrc`에 추가

```json
{
  "extends": ["@parcel/config-default"],
  "reporters":  ["...", "parcel-reporter-static-files-copy"]
}
```

static 폴더를 만들고 해당 파일 경로에 옮기기

```text
경로는 /static/ 이 기준이다
/static/images/test.jpg => src='/images/test.jpg'
```

## 빌드

package.json 속 main : index.js 부분은 지워주고 `npm run build`를 수행한다

dist 비우고 다시 재수행

```bash
rm -rf dist
npm run build # 혹은 npx parcel build
```

## servor 실행

servor는 configuration 없이(zero configuration) 편하게 배포 하기 위한 도구이다

dist에 빌드된 결과물 돌리기

```bash
rm -rf dist # 이전 결과물 지우기
npx parcel build # 빌드 아직 안했다면
npx servor dist
```

## 추가

`npm run check` : 컴파일 하면서 문제 있는지 확인

`npm run lint` : 스타일 확인

`npm run lint && npm run check` : 동시에 확인

### markdownlint-cli 로 markdown check

markdown lint 통한 스타일, 문제 확인

[링크](https://github.com/igorshubovych/markdownlint-cli)

```bash
npm install -g markdownlint-cli
npx markdownlint -f ./README.md
```

## reference

[https://github.com/ahastudio/javascript-sample-project](http://j.mp/2AkJkfA)
