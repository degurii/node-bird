const express = require('express');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('./middleware');
const db = require('../models');
const passport = require('passport');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  // 프론트로 유저 정보를 보낼 때 패스워드는 항상 빼고 보내자
  const user = Object.assign({}, req.user.toJSON());
  //console.log('\n\n\n\nreqreqreqreqreq\n\n\n\n\n', req);
  delete user.password;
  //console.log(user);
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
    //console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    // 그 후 next로 프론트로 에러를 넘긴다
    return next(e);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
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
      attributes: ['id', 'nickname'],
    });
    // 누가 팔로잉했는지 등의 id정보를 가리기 위해 수만 넘겨준다
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
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
        //console.log(fullUser);
        return res.json(fullUser);
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
});
router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
  // followings: id가 팔로잉 하고있는 사람들 -> getFollowings
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
    });
    const followings = await user.getFollowings({
      attributes: ['id', 'nickname'],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10),
    });
    res.json(followings);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
  // followers: id를 팔로우한 사람(팔로워)들 -> getFollowers
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
    });
    const followers = await user.getFollowers({
      attributes: ['id', 'nickname'],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10),
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
  // id를 팔로우한 사람(팔로워) 중 한 명을 삭제
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.removeFollower(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.addFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.removeFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.get('/:id/posts', async (req, res, next) => {
  try {
    const lastId = parseInt(req.query.lastId, 10);
    const where = {
      // 만약 parseInt 값이 0이면(혹은 null) 내 아이디에 대한 글을 반환
      UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      RetweetId: null,
    };
    if (lastId) {
      where.id = {
        [db.Sequelize.Op.lt]: lastId,
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.Image,
        },
      ],
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
module.exports = router;
