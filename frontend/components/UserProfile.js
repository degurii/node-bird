import { Card, Avatar } from 'antd';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const { me } = useSelector(state => state.user);
  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {me.Post.length}
        </div>,
        <div key="following">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="follower">
          팔로워
          <br />
          {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
    </Card>
  );
};

export default UserProfile;
