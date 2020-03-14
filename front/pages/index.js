import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';
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
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const dispatch = useDispatch();
  // countRef에는 요청을 보냈던 lastId들을 기록할 것
  const lastIdList = useRef([]);

  const onScroll = useCallback(() => {
    // window.scrollY : 스크롤 내린 거리
    // document.documentElement.clientHeight : (보여지는)화면 길이
    // document.documentElement.scrollHeight : 스크롤 최대로 내렸을 때 화면 길이
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePost) {
        // 현재까지 로드한 가장 아래 글(글은 생성시간, id의 역순)의 id보다 id가 작은 친구들을 더 로드한다
        const lastId = mainPosts.length && mainPosts[mainPosts.length - 1].id;
        if (!lastIdList.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId,
          });
        }
        lastIdList.current.push(lastId);
      }
    }
  }, [hasMorePost, mainPosts]);
  // 인피니트 스크롤링을 위해 스크롤 이벤트 리스너 달자
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts]);
  return (
    <div>
      {me && <PostForm />}
      {mainPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

Home.getInitialProps = async context => {
  // console.log(Object.keys(context));
  // 위 콘솔 로그를 실행하면 context 내용물이 보이는데,
  // store에 dispatch, getState가 있다. getState는 리덕스 state를 불러오는 함수
  //console.log(context.store);
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST,
  });
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
