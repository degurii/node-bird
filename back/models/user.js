module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      charser: 'utf8',
      collate: 'utf8_general_ci', // 이걸 해야 한글이 저장됨
    }
  );

  // belongsToMany는 웬만하면 as를 달아두는 게 좋다
  // through는 중간 테이블 명
  // as는 별칭
  User.associate = db => {
    db.User.hasMany(db.Post, { as: 'Posts' });
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'followingId',
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'followerId',
    });
  };

  return User;
};
