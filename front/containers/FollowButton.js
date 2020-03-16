import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import PropTypes from 'prop-types';

import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';

const FollowButton = ({ me, post }) => {
  const dispatch = useDispatch();

  const onFollow = useCallback(
    userId => () => {
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    []
  );
  const onUnfollow = useCallback(
    userId => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    []
  );

  return !me || post.User.id === me.id ? null : me.Followings &&
    me.Followings.find(v => v.id === post.User.id) ? (
    <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
  ) : (
    <Button onClick={onFollow(post.User.id)}>팔로우</Button>
  );
};

FollowButton.propTypes = {
  me: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
};
export default FollowButton;
