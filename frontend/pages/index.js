import React from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const dummy = {
  isLoggedIn: true,
  imagePaths: [],
  mainPosts: [
    {
      User: {
        id: 1,
        nickname: '데구리',
      },
      content: '첫 번째 게시글',
      img:
        'https://yt3.ggpht.com/a/AGF-l78VaNr9niCUfdYRZddBS7Zdtpla02dkDmSRfw=s48-c-k-c0xffffffff-no-rj-mo',
    },
    {
      User: {
        id: 2,
        nickname: '데2구리',
      },
      content: '데구리는 귀엽습니당',
    },
  ],
};
const Home = () => {
  return (
    <div>
      {dummy.isLoggedIn && <PostForm />}
      {dummy.mainPosts.map(post => (
        <PostCard key={post.User.nickname} post={post} />
      ))}
    </div>
  );
};

export default Home;
