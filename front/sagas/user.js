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
    const result = yield call(loginAPI, action.data);

    // put은 dispatch와 동일
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
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

function loadUserAPI() {
  return axios.get('/user/', {
    withCredentials: true,
  });
}
function* loadUser() {
  try {
    console.log('loadUser');
    const result = yield call(loadUserAPI);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
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

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
  ]);
}
