import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LOAD_POST_REQUEST } from '../reducers/post';

const Post = ({ id }) => {
  const { singlePost } = useSelector(state => state.post);
  return <h1>hello</h1>;
};

Post.getInitialProps = async context => {
  console.log('dispatch 전');
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });
  console.log('id: ', context.query.id);
  return { id: parseInt(context.query.id, 10) };
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Post;
