import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const Hashtag = ({ tag }) => {
  const { mainPosts } = useSelector(state => state.post);

  return (
    <div>
      {mainPosts && mainPosts.map(c => <PostCard key={c.createdAt} post={c} />)}
    </div>
  );
};

Hashtag.propTypes = {
  tag: PropTypes.string.isRequired,
};
// 인자로 들어오는 context는 _app.js의 NodeBird getInitialProps 에서 return 한 것
// getInitialProps도 Life Cycle인데, next가 임의로 추가해준 life cycle
// 라이프 사이클 중 제일 먼저 실행됨, 프론트에서도 실행되고, 서버에서도 실행됨
// 그래서 안에 서버쪽 코드를 넣어주면 됨
Hashtag.getInitialProps = async context => {
  const tag = context.query.tag;
  console.log('hashtag getInitialProps', tag);
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: tag,
  });
  // 여기서 리턴된건 Hashtag 컴포넌트의 props로 들어감
  return { tag };
};
export default Hashtag;
