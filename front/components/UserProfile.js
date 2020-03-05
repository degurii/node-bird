import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';

const UserProfile = () => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);
  return (
    <Card
    /*
      actions={[
        <div key="twit">
          짹짹
          <br />
          {me.Posts.length}
        </div>,
        <div key="Following">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="Follower">
          팔로워
          <br />
          {me.Followers.length}
        </div>,
      ]}
      */
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Link href="/">
        <a>
          <Button onClick={onLogout}>로그아웃</Button>
        </a>
      </Link>
    </Card>
  );
};

export default UserProfile;
