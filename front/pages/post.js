import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Containers, Components
import PostCard from '../containers/PostCard';

// redux 관련
import { LOAD_POST_REQUEST } from '../reducers/post';

const Post = ({ id }) => {
  const { singlePost } = useSelector(state => state.post);
  return (
    <>
      {/* Helmet은 메타 태그를 넣어주는데, 이것도 SSR을 따로 적용 해야함
          _document.js 에서 처리해주자
      */}
      <Helmet
        // 이 속성들이 _app.js에도 있는데, 겹치는건 하위 컴포넌트 우선으로 수정됨
        title={`${singlePost.User.nickname}님의 글`}
        description={singlePost.content}
        meta={[
          {
            name: 'description',
            content: singlePost.content,
          },
          {
            property: 'og:title',
            content: `${singlePost.User.nickname}님의 게시글`,
          },
          {
            property: 'og:description',
            content: singlePost.content,
          },
          {
            property: 'og:image',
            content:
              singlePost.Images[0] &&
              `http://localhost:3065/${post.Images[0].src}`,
          },
          {
            property: 'og:url',
            content: `http://localhost:3060/post/${id}`,
          },
        ]}
      />
      <PostCard post={singlePost} />;
    </>
  );
};

Post.getInitialProps = async context => {
  // console.log('dispatch 전');
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });
  // console.log('id: ', context.query.id);
  return { id: parseInt(context.query.id, 10) };
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Post;
