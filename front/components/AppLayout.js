import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Row, Col, Button } from 'antd';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
import { useSelector } from 'react-redux';
import Router from 'next/router';

const AppLayout = ({ children }) => {
  const { me } = useSelector(state => state.user);
  // 사용자가 어느 페이지로 접속할 지 모르기 때문에
  // 공통 레이아웃에서 loadUser한다

  // 프로그래밍적으로 페이지를 바꾸는게 Router
  // 컴포넌트적으로는 Link
  const onSearch = value => {
    Router.push(
      { pathname: '/hashtag', query: { tag: value } },
      `/hashtag/${value}`
    );
  };
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
            {/* Link에 prefetch를 달아두면 next에서 prefetch가 담긴 페이지를 불러올 떄 
                해당 데이터도 같이 불러옴. 
                물론 prefetch를 남발하면 code spliting한 의미가 없다
                그리고 개발환경에선 확인하기 힘들고 배포 환경에서 차이가 난다
            */}
            <Link href="/profile" prefetch>
              <a>프로필</a>
            </Link>
          </Menu.Item>,
          <Menu.Item key="mail">
            <Input.Search
              enterButton
              onSearch={onSearch}
              placeholder="hashtag"
              style={{ verticalAlign: 'middle' }}
            />
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
