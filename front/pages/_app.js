import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
// next와 redux를 함께 쓸 때 필요함
import withRedux from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';

const NodeBird = ({ Component, store, pageProps }) => {
  return (
    // redux를 쓰려면 일케 해야함. store는 state, action, dispatch가 합쳐진거라고 생각하자
    <Provider store={store}>
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
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
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
  console.log('context: ', context);
  const { ctx, Component } = context;
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

// 이 코드는 사실상 통째로 외워라 middlewares부분만 바뀐다
const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
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
  sagaMiddleware.run(rootSaga);

  return store;
};

export default withRedux(configureStore)(NodeBird);
