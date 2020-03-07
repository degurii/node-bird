const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // 이 객체를 인자로 줘야 쿠키 생성이 됨
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false, // 매번 세션 강제 저장
    saveUninitialized: false, // 빈 값도 저장
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true, // 자바스크립트에서 쿠키에 접근 못함
      secure: false, // https를 쓸 때 true
    },
    // express는 기본적으로 쿠키 이름이 connect.sid 인데, 이는 보안에 취약하므로 로그인 쿠키라는걸
    // 알아보기 힘든 이름으로 하자
    name: 'rnbck',
  })
);
// passport.session은 expressSession()을 이용하기 때문에 그 아래에 적어줘야함.
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello, server</h1>');
});

app.listen(3065, () => {
  console.log('server is running on http://localhost:3065');
});
