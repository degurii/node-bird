import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Row, Col, Card, Avatar } from 'antd';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

const dummy = {
  nickname: '데구리',
  Post: [],
  Followings: [],
  Followers: [],
  isLoggedIn: false,
};
const AppLayout = ({ children }) => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드 버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
        </Menu.Item>
      </Menu>

      <Row gutter={12}>
        <Col xs={24} md={6}>
          {dummy.isLoggedIn ? <UserProfile /> : <LoginForm />}
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
