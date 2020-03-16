import React, { useCallback } from 'react';
import { List, Button, Card, Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

// Containers, Components
import NicknameEditForm from '../containers/NicknameEditForm';
import PostCard from '../containers/PostCard';

// redux 관련
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  UNFOLLOW_USER_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';

const Profile = () => {
  const {
    followingList,
    followerList,
    hasMoreFollowers,
    hasMoreFollowings,
  } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const onUnfollow = useCallback(
    userId => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    []
  );
  const onRemoveFollower = useCallback(
    userId => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const loadMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList]);
  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followerList.length,
    });
  }, [followerList]);

  return (
    <div>
      <NicknameEditForm />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로잉 목록</div>}
        loadMore={
          hasMoreFollowings && (
            <Button onClick={loadMoreFollowings} style={{ width: '100%' }}>
              더 보기
            </Button>
          )
        }
        bordered
        dataSource={followingList}
        renderItem={item => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card
              actions={[
                <Icon key="stop" type="stop" onClick={onUnfollow(item.id)} />,
              ]}
            >
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로워 목록</div>}
        loadMore={
          hasMoreFollowers && (
            <Button onClick={loadMoreFollowers} style={{ width: '100%' }}>
              더 보기
            </Button>
          )
        }
        bordered
        dataSource={followerList}
        renderItem={item => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card
              actions={[
                <Icon
                  key="hi"
                  type="stop"
                  onClick={onRemoveFollower(item.id)}
                />,
              ]}
            >
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />
      <div>
        {mainPosts &&
          mainPosts.map(c => <PostCard key={c.createdAt} post={c} />)}
      </div>
    </div>
  );
};

Profile.getInitialProps = async context => {
  const state = context.store.getState();
  // 이 직전에 LOAD_USER_REQUEST 됨 (_app.js에서)
  // 근데 LOAD_USER_REQUEST가 끝나야 me에 정보가 들어가는데,
  // LOAD_USER_SUCCESS는 더 뒤에 실행됨
  // 이걸 해결하기 위해 두 가지 방법이 있음
  // 1. LOAD_USER_SUCCESS를 기다린 후에 해결
  //    => 복잡하고 시간도 오래 걸림
  // 2. 네 가지 request를 동시에 처리함
  //    => 아래 요청에서 만약 userId가 null이라면, 그걸 0으로 대체해서 서버로 전송
  //       서버는 user id 0으로 조회가 들어오면 내 정보를 리턴하는걸로 구현

  context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
};

export default Profile;
