import React from 'react';
// 당신의 Head, Helmet으로 대체되었다
//import Head from 'next/head';
import PropTypes from 'prop-types';
// next와 redux를 함께 쓸 때 필요함
import withRedux from 'next-redux-wrapper';
// withReduxSaga는 next와 reduxsaga를 함꼐 쓸때 필요, SSR할때 필수
import withReduxSaga from 'next-redux-saga';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Container } from 'next/app';

import AppLayout from '../components/AppLayout';

import reducer from '../reducers';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';

const NodeBird = ({ Component, store, pageProps }) => {
  return (
    // 얘는 Helmet 쓰고 SSR적용할떄 감싼다
    <Container>
      {/* redux를 쓰려면 일케 해야함. store는 state, action, dispatch가
      합쳐진거라고 생각하자*/}
      <Provider store={store}>
        {/* <Head> 태그랑 Helmet의 Head랑 충돌하기 때문에 Helmet으로 바꿔준다 
            Helmet을 SSR해야함
        */}
        <Helmet
          title="NodeBird"
          htmlAttributes={{ lang: 'ko' }}
          meta={[
            {
              charset: 'UTF-8',
            },
            {
              name: 'viewport',
              content:
                'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
            },
            {
              'http-equiv': 'X-UA-Compatible',
              content: 'IE=edge',
            },
            {
              name: 'description',
              content: '데구리의 NodeBird SNS',
            },
            { name: 'og:title', content: 'NodeBird' },
            {
              name: 'og:description',
              content: '데구리의 NodeBirs SNS',
            },
            {
              property: 'og:type',
              content: 'website',
            },
          ]}
          link={[
            {
              rel: 'shortcut icon',
              href: '/favicon.ico',
            },
            {
              rel: 'stylesheet',
              href:
                'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css',
            },
            {
              rel: 'stylesheet',
              href:
                'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
            },
            {
              rel: 'stylesheet',
              href:
                'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
            },
          ]}
          script={[
            {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js',
            },
          ]}
        />
        {/*
        <Head>
          <title>NodeBird</title>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
          />
          >
          <link
            rel="stylesheet"
            type="text/css"
            charset="UTF-8"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
        </Head>
        */}
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </Provider>
    </Container>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};

// 이 함수는 동적 라우팅을 위해
// next에서 앱으로 context를 내려줌
// 그 context 안에 component나 ctx가 들어있음
// component는 페이지들
NodeBird.getInitialProps = async context => {
  //console.log('context: ', context);
  const { ctx, Component } = context;
  let pageProps = {};

  // 아래 부분 순서도 상관있음
  // 리덕스 사가 호출 순서대로 맞춰서 작성하자
  const state = ctx.store.getState();
  // 서버 사이드 렌더링의 경우
  // 클라이언트(브라우저) -> 백엔드로 요청이 아닌
  // 프론트 서버 -> 백엔드 서버로 요청하기 때문에
  // 쿠키를 우리가 따로 설정해서 넣어줘야함
  // 아래 ctx.req는 서버 환경에서만 존재함, 그러니까 클라환경/서버환경 구분해주자
  axios.defaults.headers.Cookie = '';
  const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
  // 서버환경이고, 쿠키도 있으면 axios에 쿠키를 심어주자
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }

  // _app.js 안에서 쓰는 component들을 호출해주는 부분
  if (Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(ctx)) || {};
  }
  return { pageProps };
};

// 이 코드는 사실상 통째로 외워라 middlewares부분만 바뀐다
const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();

  // 다음처럼 커스텀 미들웨어도 만들 수 있다
  // store => next => action => {} 꼴의 3단 currying 함수를 만들면 됨
  const logActionMiddleware = store => next => action => {
    console.log(action);
    next(action);
  };
  const middlewares = [sagaMiddleware];

  // 배포시 redux 크롬 익스텐션 적용 부분을 빼줘야 함
  // NODE_ENV === 'production' 인지 체크해서 compose
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          // 아래 코드는 리덕스 공홈에 있음. 크롬 익스텐션 적용할 때 쓴다고함 외워
          !options.isServer &&
            window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : f => f
        );
  const store = createStore(reducer, initialState, enhancer);
  // withReduxSaga 사용시 아래처럼 해줘야함
  store.sagaTask = sagaMiddleware.run(rootSaga);

  // withRedux만 사용시 위처럼 안하고 아래처럼만 해주면 됨
  // sagaMiddleware.run(rootSaga);

  return store;
};

// withRedux, withReduxSaga를 함께 적용
export default withRedux(configureStore)(withReduxSaga(NodeBird));
