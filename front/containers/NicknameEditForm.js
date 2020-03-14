import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
  const [newNickname, setNewNickname] = useState('');
  const dispatch = useDispatch();
  const { me, isEditingNickname } = useSelector(state => state.user);

  const onChangeNickname = useCallback(e => {
    setNewNickname(e.target.value);
  }, []);

  const onEditNickname = useCallback(
    e => {
      e.preventDefault();
      dispatch({
        type: EDIT_NICKNAME_REQUEST,
        data: newNickname,
      });
    },
    [newNickname]
  );
  return (
    <Form
      style={{
        marginBottom: '20px',
        border: '1px solid #d9d9d9',
        padding: '20px',
      }}
      onSubmit={onEditNickname}
    >
      <Input
        addonBefore="닉네임"
        value={newNickname || (me && me.nickname)}
        onChange={onChangeNickname}
      />
      <Button type="primary" htmlType="submit" loading={isEditingNickname}>
        수정
      </Button>
    </Form>
  );
};

export default NicknameEditForm;
