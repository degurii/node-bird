import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_ssef_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';
import { Avatar, Card } from 'antd';
import { LOAD_USER_REQUEST } from '../reducers/user';

const User = () => {
  const { mainPosts } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.user);

  return (
    <div>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="Following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="Follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts.map(post => (
        <PostCard key={post.createdAt} post={post} />
      ))}
    </div>
  );
};

User.propTypes = {
  id: PropTypes.number.isRequired,
};
User.getInitialProps = async context => {
  // 이 함수는 처음으로 페이지를 불러올 때 서버쪽에서 실행,
  // 프론트에서 next 라우터로 페이지 이동시에는 프론트에서 실행
  // 여기서 axios 등을 이용해 데이터를 받아올 수 있지만
  // 우리는 프론트엔드 비동기 호출은 모두 redux-saga에서 처리
  // 그러니까 SSR을 위해 여기서 redux action을 dispatch해주면 된다
  const id = parseInt(context.query.id, 10);
  // console.log('user getInitialProps', id);
  const state = context.store.getState();
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: id,
  });
  context.store.dispatch({
    type: LOAD_ssef_POSTS_REQUEST,
    data: id,
  });

  return { id };
};

export default User;
