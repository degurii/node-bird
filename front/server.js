const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
/*
  next는 동적 라우팅을 지원하지 않기 때문에 (ex. /hashtag/like)
  express와 next를 연결해 사용한다
*/
const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
  const server = express();
  server.use(morgan('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      secret: '',
      cookie: {
        httpOnly: true,
        secure: false,
      },
    })
  );

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3060, err => {
    console.log('next+express running on port 3060');
  });
});
