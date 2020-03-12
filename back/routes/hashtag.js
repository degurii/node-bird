const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
  try {
    const where = {};
    const lastId = parseInt(req.query.lastId, 10);
    if (lastId) {
      where.id = {
        [db.Sequelize.Op.lt]: lastId,
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.Hashtag,
          // 한글, 특수문자 등이 주소에 써질 땐 URIComponent로 바뀌기 때문에 decode해줘야 함
          where: { name: decodeURIComponent(req.params.tag) },
        },
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          through: 'Like',
          as: 'Likers',
          attributes: ['id'],
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
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10),
    });
    console.log(posts);
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
