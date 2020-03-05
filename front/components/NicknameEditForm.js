import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';

const NicknameEditForm = () => {
  const [newNickname, setNewNickname] = useState('');

  const onChangeNicknameInput = useCallback(e => {
    setNewNickname(e.target.value);
  }, []);
  return (
    <Form
      style={{
        marginBottom: '20px',
        border: '1px solid #d9d9d9',
        padding: '20px',
      }}
    >
      <Input
        addonBefore="닉네임"
        value={newNickname}
        onChange={onChangeNicknameInput}
      />
      <Button type="primary" htmlType="submit">
        수정
      </Button>
    </Form>
  );
};

export default NicknameEditForm;
