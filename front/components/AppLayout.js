import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Row, Col, Button } from 'antd';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_USER_REQUEST } from '../reducers/user';

const AppLayout = ({ children }) => {
  const { me } = useSelector(state => state.user);
  // 사용자가 어느 페이지로 접속할 지 모르기 때문에
  // 공통 레이아웃에서 loadUser한다
  const dispatch = useDispatch();
  useEffect(() => {
    if (!me) {
      dispatch({
        type: LOAD_USER_REQUEST,
      });
    }
  }, []);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드 버드</a>
          </Link>
        </Menu.Item>
        {me && [
          <Menu.Item key="profile">
            <Link href="/profile">
              <a>프로필</a>
            </Link>
          </Menu.Item>,
          <Menu.Item key="mail">
            <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
          </Menu.Item>,
        ]}
      </Menu>

      <Row gutter={12}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Link href="https://degurii.tistory.com/">
            <a target="_blank">
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                degurii web
              </span>
            </a>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  childeren: PropTypes.node,
};
export default AppLayout;
