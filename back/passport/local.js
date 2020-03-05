const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'userId',
        passwordField: 'password',
      },
      async (userId, password, done) => {
        try {
          const user = await db.User.findOne({ where: { userId } });
          if (!user) {
            // done: passport에선 첫 인자가 서버에러일 때 1(아니면 null),
            // 두번째 인자가 성공했을때, 세번째는 서버 에러는 아닌데 로직상에서 에러 이유
            return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: '비밀번호가 틀립니다.' });
        } catch (e) {
          console.error(e);
          return done(e);
        }
      }
    )
  );
};
