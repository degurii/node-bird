import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';
//import { loginAction, logoutAction } from '../reducers/user';
/*
// Hooks를 지원 안했을때 High-order Component를 이용해서 사용했던 방법
import { connect } from 'react-redux';
*/

/*
// Hooks를 지원 안했을때 High-order Component를 이용해서 사용했던 방법
const Home = ({ user, dispatch, login, logout }) =>{
*/
const Home = () => {
  // 아래 인자로 주어진 state는 '../reducers/index.js' 에 있는 state
  // 따라서 state.user는 user.js를 의미하며, useSeletor로 그 파일의 initialState를 가져온다
  // const { isLoggedIn, user } = useSelector(state => state.user);
  // 위처럼 쓰면 되긴 하는데, 리렌더링이 자주 발생할 수 있으므로 적절한 선에서 아래처럼 쪼개어 불러온다.
  const { me } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_MAIN_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {}, []);
  return (
    <div>
      {me && <PostForm />}
      {me &&
        mainPosts.map(post => (
          <PostCard key={post.User.nickname} post={post} />
        ))}
    </div>
  );
};

export default Home;

/*
// Hooks를 지원 안했을때 High-order Component를 이용해서 사용했던 방법
// 아래 함수는 redux state를 react props로 만들어주는 함수

function mapStateToProps(state){
  return{
    user: state.user,
  }
}

function mapDispatchToProps(dispatch){
  return {
    login: () => dispatch(loginAction),
    logout: () => dispatch(logoutAction),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
*/
