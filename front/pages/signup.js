import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import router from 'next/router';

import { SIGN_UP_REQUEST } from '../reducers/user';

export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback(e => {
    setter(e.target.value);
  }, []);
  return [value, handler];
};

const Signup = () => {
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [id, onChangeId] = useInput('');
  const [nickname, onChangeNick] = useInput('');

  const { isSigningUp, isLoggedIn } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      if (password !== passwordCheck) {
        return setPasswordError(true);
      }
      if (!term) {
        return setTermError(true);
      }
      dispatch({
        type: SIGN_UP_REQUEST,
        data: {
          userId: id,
          password,
          nickname,
        },
      });
    },
    [id, nickname, password, passwordCheck, term]
  );

  const onChangePassword = useCallback(
    e => {
      setPassword(e.target.value);
      setPasswordError(e.target.value !== passwordCheck);
    },
    [passwordCheck]
  );
  /*
  const onChangeId = e => {
    setId(e.target.value);
  };
  const onChangeNick = e => {
    setNick(e.target.value);
  };
  const onChangePassword = e => {
    setPassword(e.target.value);
  };
  */
  const onChangePasswordCheck = useCallback(
    e => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password]
  );

  const onChangeTerm = useCallback(e => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form
        onSubmit={onSubmit}
        style={{
          padding: '20px 20px',
          margin: '0 auto',
          width: '400px',
          height: '450px',
          border: '1px solid rgba(2, 2, 2, 0.35)',
          borderRadius: '8px',
          display: 'flex',
          flexFlow: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
            justifyContent: 'space-around',

            height: '64%',
          }}
        >
          <div>
            <label htmlFor="user-id">아이디</label>
            <br />
            <Input name="user-id" value={id} required onChange={onChangeId} />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input
              name="user-nickname"
              value={nickname}
              required
              onChange={onChangeNick}
            />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input
              name="user-password"
              type="password"
              value={password}
              required
              onChange={onChangePassword}
            />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호 확인</label>
            <br />
            <Input
              name="user-password-check"
              type="password"
              value={passwordCheck}
              required
              onChange={onChangePasswordCheck}
            />
            {passwordError && (
              <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>
            )}
          </div>
        </div>
        <div>
          <div>
            <Checkbox name="user-term" onChange={onChangeTerm}>
              데구리가 귀엽다는 사실에 동의합니다.
            </Checkbox>
            {termError && <div style={{ color: 'red' }}>인정하세요.</div>}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={isSigningUp}>
              가입하기
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};
export default Signup;
