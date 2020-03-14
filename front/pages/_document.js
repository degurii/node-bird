// 얘는 HTML의 역할을 한다

import React from 'react';
// Main이 _app.js 가 될 것
import Document, { Main, NextScript } from 'next/document';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
// styled component도 SSR을 해줘야 한다
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static getInitialProps(context) {
    // 이걸 해줘야 헬멧 SSR이 적용된다
    // postman 에서 꼭 확인하자
    // _app의 상위인 _document에서 _app을 실행해주는 부분
    // document -> 렌더링 -> app.js -> (Component.getInitialProps) -> 하위 컴포넌트로
    // page를 딱히 쓰진 않는데 나중에 console.log 찍어보고 필요한거 같으면 써라
    // this.props.page에 담겨있다

    const sheet = new ServerStyleSheet();
    const page = context.renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();

    return { ...page, helmet: Helmet.renderStatic(), styleTags };
  }

  render() {
    // ...helmet에는 meta 태그, link 태그, script 태그 등이 들어있다
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
    const htmlAttrs = htmlAttributes.toComponent();
    const bodyAttrs = bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>
          {this.props.styleTags}
          {Object.values(helmet).map(el => el.toComponent())}
        </head>
        <body {...bodyAttrs}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.propTypes = {
  helmet: PropTypes.object.isRequired,
  styleTags: PropTypes.object.isRequired,
};
export default MyDocument;
