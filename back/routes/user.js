const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => {
  if (!req.user) {
    return res.status(401).send('로그인이 필요합니다.');
  }
  // 프론트로 유저 정보를 보낼 때 패스워드는 항상 빼고 보내자
  const user = Object.assign({}, req.user.toJSON());
  delete user.password;
  console.log(user);
  return res.json(user);
});

// 회원가입
router.post('/', async (req, res, next) => {
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt는 10~13 사이로
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    // 그 후 next로 프론트로 에러를 넘긴다
    return next(e);
  }
});
router.get('/:id', (req, res) => {});
router.post('/logout', (req, res) => {
  console.log('logout');
  req.logout();
  req.session.destroy();
  res.send('logout 성공');
});
router.post('/login', (req, res, next) => {
  // 아래 authenticate() 콜백함수 인자는 local strategy의 done에서 받아오는 인자
  passport.authenticate('local', (err, user, info) => {
    //console.log(err, user, info);
    if (err) {
      console.error(err);
      next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async loginErr => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: { id: user.id },
          include: [
            {
              model: db.Post,
              as: 'Posts',
              attributes: ['id'],
            },
            {
              model: db.User,
              as: 'Followings',
              attributes: ['id'],
            },
            {
              model: db.User,
              as: 'Followers',
              attributes: ['id'],
            },
          ],
          attributes: ['id', 'nickname', 'userId'],
        });
        console.log(fullUser);
        return res.json(fullUser);
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
});
router.get('/:id/follow', (req, res) => {});
router.post('/:id/follow', (req, res) => {});
router.delete('/:id/follow', (req, res) => {});
router.get('/:id/posts', (req, res) => {});

module.exports = router;
