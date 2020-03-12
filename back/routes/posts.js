const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const where = {};
    const lastId = parseInt(req.query.lastId, 10);
    if (parseInt(req.query.lastId, 10)) {
      where.id = {
        // db.Sequelize.Op.lt 는 < 부등호(less than)
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
      order: [['createdAt', 'DESC']], // 내림차순 정렬
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
