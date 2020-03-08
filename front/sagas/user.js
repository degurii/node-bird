import {
  all,
  fork,
  takeEvery,
  delay,
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  EDIT_NICKNAME_REQUEST,
  EDIT_NICKNAME_SUCCESS,
  EDIT_NICKNAME_FAILURE,
} from '../reducers/user';

// xxxAPI(), wacthXxx(), xxx() 세 개의 함수가 사이클을 이룬다
// API는 서버에 요청을 보내는 함수

function loginAPI(loginData) {
  // 서버에 요청을 보내는 부분
  // 아래 axios.post의 세 번째 인자로 withCredentials: true를 주면 서버와 쿠키를 주고받을 수 있다
  // 서버쪽에서도 처리를 해줘야함(cors가 담당)
  return axios.post('/user/login', loginData, {
    withCredentials: true,
  });
}
function* login(action) {
  try {
    const res = yield call(loginAPI, action.data);

    // put은 dispatch와 동일
    yield put({
      type: LOG_IN_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}
function* watchLogIn() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData) {
  return axios.post('/user/', signUpData);
}
function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e,
    });
  }
}
function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logOutAPI() {
  return axios.post(
    '/user/logout',
    {},
    {
      withCredentials: true,
    }
  );
}
function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e,
    });
  }
}
function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function loadUserAPI(userId) {
  return axios.get(`/user/${userId ? userId : ''}`, {
    withCredentials: true,
  });
}
function* loadUser(action) {
  try {
    const res = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: res.data,
      // 아래 me는 리듀서에서 me에 내 정보를 넣을지 말지 알려줌
      // 내 아이디 로드면 me: true, 아니면 false
      me: !action.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}
function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

function followUserAPI(userId) {
  return axios.post(
    `/user/${userId}/follow`,
    {},
    {
      withCredentials: true,
    }
  );
}
function* followUser(action) {
  try {
    const res = yield call(followUserAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e,
    });
  }
}
function* watchFollowUser() {
  yield takeEvery(FOLLOW_USER_REQUEST, followUser);
}

function unfollowUserAPI(userId) {
  return axios.delete(`/user/${userId}/follow`, {
    withCredentials: true,
  });
}
function* unfollowUser(action) {
  try {
    const res = yield call(unfollowUserAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e,
    });
  }
}
function* watchUnfollowUser() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollowUser);
}

function loadFollwersAPI(userId) {
  return axios.get(`/user/${userId}/followers`, {
    withCredentials: true,
  });
}
function* loadFollowers(action) {
  try {
    const res = yield call(loadFollwersAPI, action.data);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e,
    });
  }
}
function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function loadFollwingsAPI(userId) {
  return axios.get(`/user/${userId}/followings`, {
    withCredentials: true,
  });
}
function* loadFollwings(action) {
  try {
    const res = yield call(loadFollwingsAPI, action.data);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e,
    });
  }
}
function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollwings);
}

function removeFollowerAPI(userId) {
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true,
  });
}
function* removeFollower(action) {
  try {
    const res = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e,
    });
  }
}
function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editNicknameAPI(nickname) {
  return axios.patch(
    `/user/nickname`,
    { nickname },
    {
      withCredentials: true,
    }
  );
}
function* editNickname(action) {
  try {
    const res = yield call(editNicknameAPI, action.data);
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: EDIT_NICKNAME_FAILURE,
      error: e,
    });
  }
}
function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchFollowUser),
    fork(watchUnfollowUser),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname),
  ]);
}
