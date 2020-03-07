import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';

import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from '../reducers/post';

const PostForm = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const { imagePaths, isAddingPost, postAdded } = useSelector(
    state => state.post
  );
  const imageInput = useRef();

  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      if (!text || !text.trim()) {
        return alert('게시글을 작성하세요.');
      }
      // formData에 글과 사진을 함께 넣고 서버로 전송
      const formData = new FormData();
      imagePaths.forEach(i => {
        formData.append('image', i);
      });
      formData.append('content', text);
      dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });
    },
    [text, imagePaths]
  );

  const onChangeText = useCallback(e => {
    setText(e.target.value);
  }, []);

  // 이미지와 글을 한 번에 서버로 보내면 편하지만,
  // 이미지는 업로드하는 비용이 크기때문에 따로 처리한다
  const onChangeImages = useCallback(e => {
    console.log(e.target.files);
    // 원래 multipart/form-data 하고 서브밋하면 폼 데이터가 서버로 전송되는데
    // 폼데이터를 바로 서버로 보내는 게 아니라 ajax로 보내기 때문에
    // 일일이 이미지를 어펜드 해줘야함
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, f => {
      // append의 첫 번째 인수를 서버쪽에서도 그 이름으로 인식하기 때문에 정확히 해줘야함
      // append(key, value) 형식
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onClickImageUpload = useCallback(
    e => {
      imageInput.current.click();
    },
    [imageInput.current]
  );

  useEffect(() => {
    if (postAdded) {
      setText('');
    }
  }, [postAdded]);

  const onRemoveImage = useCallback(
    index => () => {
      dispatch({
        type: REMOVE_IMAGE,
        index,
      });
    },
    []
  );
  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data"
      onSubmit={onSubmitForm}
    >
      <Input.TextArea
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
        value={text}
        onChange={onChangeText}
      />
      <div>
        {
          // 여기있는 버튼이랑 input엔 이미지 업로드하는 기능을 추가해야함.
        }
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type="primary"
          style={{ float: 'right' }}
          htmlType="submit"
          loading={isAddingPost}
        >
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img
              src={'http://localhost:3065/' + v}
              style={{ width: '200px' }}
              alt={v}
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
