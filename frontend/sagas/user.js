import { all, fork, takeEvery, delay, put } from 'redux-saga/effects';
import axios from 'axios';

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
} from '../reducers/user';

// xxxAPI(), wacthXxx(), xxx() 세 개의 함수가 사이클을 이룬다
// API는 서버에 요청을 보내는 함수

function loginAPI() {
  // 서버에 요청을 보내는 부분
  return axios.post('/login');
}
function* login() {
  try {
    //yield call(loginAPI);
    // put은 dispatch와 동일
    yield delay(500);
    yield put({
      type: LOG_IN_SUCCESS,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}
function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI() {
  return axios.post('/signup');
}
function* signUp() {
  try {
    yield delay(500);
    throw new Error('회원가입 에러');
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

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchSignUp)]);
}
