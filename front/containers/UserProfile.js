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
      actions={[
        <Link href="/profile" key="twit" prefetch>
          <a>
            <div>
              짹짹
              <br />
              {me.Posts.length}
            </div>
          </a>
        </Link>,
        <Link href="/profile" key="Following" prefetch>
          <a>
            <div>
              팔로잉
              <br />
              {me.Followings.length}
            </div>
          </a>
        </Link>,
        <Link href="/profile" key="Follower" prefetch>
          <a>
            <div>
              팔로워
              <br />
              {me.Followers.length}
            </div>
          </a>
        </Link>,
      ]}
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
