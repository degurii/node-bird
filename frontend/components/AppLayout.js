import React, { useCallback } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Row, Col, Button } from 'antd';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../reducers/user';

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const onClickLogoutButton = useCallback(() => {
    dispatch(logoutAction);
  }, []);
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드 버드</a>
          </Link>
        </Menu.Item>
        {isLoggedIn && [
          <Menu.Item key="profile">
            <Link href="/profile">
              <a>프로필</a>
            </Link>
          </Menu.Item>,
          <Menu.Item key="mail">
            <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
          </Menu.Item>,
          <Menu.Item
            key="logout"
            onClick={onClickLogoutButton}
            style={{ float: 'right' }}
          >
            <Link href="/">
              <a>
                <Button type="default" style={{ verticalAlign: 'middle' }}>
                  로그아웃
                </Button>
              </a>
            </Link>
          </Menu.Item>,
        ]}
      </Menu>

      <Row gutter={12}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
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
