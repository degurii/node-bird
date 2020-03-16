// next가 webpack, babel 설정 등을 자동으로 제공해주지만
// 이를 우리가 커스터마이징해서 최적화 할 수 있다
// 해당 설정 옵션은 공식문서에 나와있따
// 여기서 알려주는건 중요한거만

const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
// 뭘 대체해야할지 모르겠으니까 우리 서비스를 먼저 분석해야함
// npm i @zeit/next-bundle-analyzer 실행해서 번들 애널라이저 깔자
// 아래처럼 감싸주면 됨
// 나중에 typescript나 sass를 next에 적용해야 하는 경우도 있는데
// 얘네도 withXXXX꼴로 패키지가 다 있다 이말이야
// 비슷하게 HOC 꼴로 감싸서 쓰면됨
// 근데 이건 강의에서 알려준건데 지금보니까 6번줄 패키지는 next 안으로 흡수됐음
// 아마 next 버전9로 올라가면서 업데이트된듯

// 이건 어케 쓰냐면 npm run build
module.exports = withBundleAnalyzer({
  distDir: '.next', // next가 빌드한 파일들을 어느 경로에 만들 건지
  // 아래는 공식문서에 있는 bundle analyzer 셋팅

  // build, start시에 BUNDLE_ANALYZE, NODE_ENV에 환경 변수를 넣어줄 수 있는ㄷㅔ
  // 윈도우에선 명령어로 못넣으니까 cross-env 설치해서 실행하자
  // both를 넣어주면 서버쪽도, 클라쪽도 분석해준다
  // 번들 하나하나가 500KB를 넘지 않도록 해주자
  // 파일ㄹ이 너무 클 때 검색어로 "Tree shaking"이라는 검색어를 사용
  // ex) ant design icons too big
  // ex) ant design icons tree shaking
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },

  webpack(config) {
    // config를 console.log 해보면 넥스트가 웹팩 설정을 어떻게 했는지 알 수 있음
    // console.log('config', config);
    // 원래 config를 그대로 두고, 수정할 부분만 따로 넣어줌
    const prod = process.env.NODE_ENV === 'production';
    /*
    console.log('config', config);
    console.log('rules', config.moduel.rules[0]);
    */
    const plugins = [
      ...config.plugins,
      // load `moment/locale/ko.js` and `moment/locale/it.js`
      // moment treeshaking
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ko/),
    ];
    if (prod) {
      // 얘는 gzip 압축해줌
      plugins.push(new CompressionPlugin()); // main.js.gz
    }
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      // hidden-source-map: 소스코드 숨기면서 에러 시 소스맵 제공
      // eval: 빠르게 웹팩 적용
      devtool: prod ? 'hidden-source-map' : 'eval',

      plugins,
    };
  },
});
