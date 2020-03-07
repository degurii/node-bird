import { all, takeLatest, fork, put, delay, call } from 'redux-saga/effects';
import axios from 'axios';

import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  LOAD_COMMENTS_REQUEST,
  LOAD_COMMENTS_SUCCESS,
  LOAD_COMMENTS_FAILURE,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_MAIN_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
} from '../reducers/post';

function loadMainPostsAPI() {
  return axios.get('/posts');
}
function* loadMainPosts() {
  try {
    const res = yield call(loadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}
function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

function loadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`);
}
function* loadHashtagPosts(action) {
  try {
    const res = yield call(loadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}
function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function loadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`);
}
function* loadUserPosts(action) {
  try {
    const res = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}
function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true,
  });
}
function* addPost(action) {
  try {
    const res = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: res.data,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function addCommentAPI(data) {
  return axios.post(
    `/post/${data.postId}/comment`,
    { content: data.content },
    {
      withCredentials: true,
    }
  );
}
function* addComment(action) {
  try {
    const res = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
        comment: res.data,
      },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`);
}
function* loadComments(action) {
  try {
    const res = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: res.data,
      },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e,
    });
  }
}
function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

// form 데이터(이미지데이터)를 전송해준다
// 글 작성중에 이미지를 미리 처리하는 방식이므로 게시물 id를 알 수 없다
function uploadImagesAPI(formData) {
  return axios.post(`/post/images`, formData, {
    withCredentials: true,
  });
}
function* uploadImages(action) {
  try {
    const res = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      // 이미지 업로드가 완료되면 서버는 그 이미지가 어디에 저장됐는지 주소를 보내줌
      // 그 주소를 이용해 미리보기도 할 수 있고, 실제 글 올릴때 같이 업로드 하면됨
      data: res.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}
function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
export default function* postSaga() {
  yield all([
    fork(watchLoadMainPosts),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
  ]);
}
