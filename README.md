# CRA to next

create-react-app project 를 next.js 기반으로 migartion 하기

기존에 작업하던 React 코드를 만약 Next.js 기반으로 작업해야 한다면 어떻게 해야 할까? 사실 기본적으로 수많은 boilerplate 가 존재하기 때문에 잘 만들어진 next.js & react 프로젝트를 찾아서 거기에 새로 작업하는 것도 나쁘지 않은 선택이다.

- `npx create-next-app precedent --example "https://github.com/steven-tey/precedent"`
- `npx create-next-app nextjs-blog --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"`
- `git clone git@github.com:vercel/commerce.git`
- `yarn create next-app [project name] –typescript`

예를 들면 위와 같은 프로젝트들은 처음에 시작하기에 나름 괜찮은 boilerplate 이다. 하지만 from scratch 부터 작업 하는 것이 아니기 때문에 정확한 동작에 대한 이해가 부족 할 수 있다. 그래서 React 프로젝트중 가장 유명한 boilerplate 인 create-react-app 프로젝트를 next.js 기반으로 동작 할 수 있게끔 migration 해보면서 작동 원리에 대해 이해햐는 시간을 가져보겠습니다.

### Migrating from Create React App ([공식문서 참조](https://nextjs.org/docs/migrating/from-create-react-app))

1. package.json 안에 있는 실행 명령들을 전부 `next` 기반으로 수정 해주어야 합니다.

```tsx
$ yarn add next
$ yarn remove react-scripts
```

CRA (create-react-app) 프로젝트 에서는 react-scripts 명령을 기반으로 동작한다. 이제 더이상 사용안하기 때문에 삭제하면된다.

```tsx
"scripts": {
    "dev": "next dev",
    "start": "next start",
    "build": "next build",
},
```

여기서

- next dev: development 환경에서 앱 실행
- next start: production 환경에서 앱 실행 next start 가 제대로 적용 된 것을 확인하기 위해서는 항상 `next build` 를 해주어야 한다.

최신 boilerplate 나 프로젝트들을 보면 `turbo` 를 이용하여 monorepo 관리해주는 방식으로 명령을 지정해주는 경우도 많이 있다. 이 경우는 일단 next 기반으로 migration 하는 게 목적이기 때문에 `turbo` 를 사용하지는 않겠습니다.

2. gitignore 파일 설정

그리고 나서 추가적으로 next 기반으로 프로젝트를 실행할 것 이기 때문에 next 로 빌드된 내용들을 remote repository 로 올리기 않기 위해 `.gitigonre` 설정을 따로 해주면 된다.

```tsx
// .gitignore
.next
```

3. 정적파일 위치 변경 및 pages/\_document.js 파일 설정 ([Custom Document](https://nextjs.org/docs/advanced-features/custom-document))

next.js 프로젝트에서 기본적으로 정적인 파일들은 전부 public 에서 관리해준다. 예를 들면 svg,png 와 같은 assets 들이 여기에 포함된다. 이러한 파일들을 전부 public 폴더 안으로 이동 시켜준다. 현재 CRA 프로젝트로 만들었을때 제공되는 파일들중 public 에 들어가야 하는 파일은 `logo.svg` 정도 이다.

react 기반의 프로젝트에서 document 는 index.html 에서 관리가 된다. next.js 에서는 `pages/_document.js` 혹은 `pages/_document.tsx` 에서 아래와 같이 관리해주면된다.

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

`index.html` 에서 html 구조를 가져올때 아마 `PUBLIC_URL` 이 경로에 들어가 있을텐데, 이제는 root 에서 처리해주기 때문에 필요가 없다.

4. pages/\_app.js 만들기 ([Custom App](https://nextjs.org/docs/advanced-features/custom-app))

Next.js는 App component를 사용하여 페이지를 초기화합니다. 이를 재정의하고 페이지 초기화를 제어할 수 있으며 다음과 같은 기능들을 수행할 수 있습니다:

- 페이지 변경 간 레이아웃 유지 (Persist layouts between page changes)
- 페이지 탐색 시 상태 유지 (Keeping state when navigating pages)
- 페이지에 추가 데이터 삽입 (Inject additional data into pages)
- 글로벌 CSS 추가 (Add global CSS)

```tsx
import Head from "next/head";
import "../styles/global.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>React App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

만약 typescript 로 작성하신다면 타입을 추가해주셔야 합니다.

```tsx
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

5. pages/index.js (index.tsx) 만들기

기존에 src 폴더안에 App.js 안의 코드들은 이제 next.js 에서 index.js 로 들어가게된다. 이때 주의 해야 할 것은 파일 위치가 달라지기 때문에 import 하는 경로도 맞게 수정해주어야 한다.

추가적으로 다음과 같은 기능을 구현하려고 한다면 next.js 는 친절하게도 기본적으로 다 제공해준다.

- css,sass,assets 들을 위한 file-loader
- polyfill
- code splitting
- postcss setup
- babel config / webpack config
