const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const { isLoggedIn, existPost } = require('./middleware');

const router = express.Router();

// 이미지를 formData로 전송했는데, form data는 bodyparser로는 처리를 못함
// 그래서 multer라는 미들웨어를 사용
// 아래는 multer 설정
const upload = multer({
  storage: multer.diskStorage({
    // 서버 디스크에 파일을 저장하겠다는 뜻
    // 이걸 나중에 s3, 구글 클라우드 스토리지 등에 저장할 수도 있음
    // cb는 passport의 done이라고 생각하면 편함
    destination(req, file, cb) {
      // 어떤 경로에 저장할지
      cb(null, 'uploads');
    },
    filename(req, file, cb) {
      // 파일 이름 지정
      // 겹칠 수도 있으니까 파일이름에 시간을 껴줌
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    },
  }),
  // filesize 제한, byte 단위, 너무 크면 해커 공격의 수단이 될 수도 있음
  // 기타 등등 multer 옵션을 더 찾아볼 것
  limits: { fileSize: 20 * 1024 * 1024 },
});

// 직접 만든 미들웨어인isLoggedIn을 적용한다
// isLoggedIn 실행 -> 다음 미들웨어실행(async (req, res, next)=>{})
// multer를 upload.none()으로 설정하면
// form data의 파일은 req.file(여러개면 files)로,
// 일반 값은 req.body로 들어감
router.post('/', upload.none(), isLoggedIn, async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );
      console.log(result);
      await newPost.addHashtags(result.map(r => r[0]));
    }

    if (req.body.image) {
      console.log('이미지가 있엉');
      // 이미지 주소를 여러 개 올리면 배열로 들어옴
      if (Array.isArray(req.body.image)) {
        console.log('여러개얌');
        const images = await Promise.all(
          req.body.image.map(image => {
            return db.Image.create({ src: image });
          })
        );
        await newPost.addImages(images);
      } else {
        console.log('하나얌');
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }
    } else {
      console.log('이미지가 없엉');
    }
    // 방법1
    // const User = await newPost.getuser();
    // newPost.User = User;
    // res.json(newPost);

    // 방법2
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [
        { model: db.User, attributes: ['id', 'nickname'] },
        { model: db.Image },
      ],
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// upload.arry('image'): 이미지를 여러 장 올릴 때
// upload.single('image'): 한 장만 올린다
// upload.fields([{name: 'image'}, {name: 'img}]): 전송받는 이름이 여러개일 때
// upload.none(): 폼데이터를 보냈는데 파일이 하나도 안올릴 때
router.post('/images', upload.array('image'), (req, res, next) => {
  // upload로 받은 이미지 결과는 req.files에 저장되어있음
  // single이면 req.file 에 있음
  console.log(req.files);
  res.json(req.files.map(v => v.filename));
});

router.delete('/:id', isLoggedIn, existPost, async (req, res, next) => {
  try {
    await db.Post.destroy({ where: { id: req.params.id } });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.get('/:id/comments', existPost, async (req, res, next) => {
  try {
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.post('/:id/comment', isLoggedIn, existPost, async (req, res, next) => {
  // POST /api/post/3/commnet
  try {
    /*
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    */
    const post = req.post;
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.json(comment);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.post('/:id/like', isLoggedIn, existPost, async (req, res, next) => {
  try {
    const post = req.post;
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    // 항상 게시글이 있는지 먼저 확인해야 함
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    if (req.user.id === post.UserId) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = await db.Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.Post,
          as: 'Retweet',
          include: [
            {
              model: db.User,
              attributes: ['id', 'nickname'],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
    });
    res.json(retweetWithPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
