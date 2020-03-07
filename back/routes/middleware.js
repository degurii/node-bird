exports.isLoggedIn = (req, res, next) => {
  // 아래 함수는 express, passport에서 공식적으로 지원하는 함수
  // 로그인을 했는지 판단
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('비회원 전용');
  }
};
