import h from 'react-hyperscript';

import { NextContext } from 'next';

import Layout from '../components/layout';

function getPosts() {
  return [
    { id: 'das-ist-ein-test', title: 'Das ist ein Test', description: '...' }
  ];
}

interface PostProps {
  post: Post;
}

const Post = function (props: PostProps) {
  return h(Layout, {
    children: [
      h('h1', props.post.title)
    , h('ul', props.post.description)
    ]
  });
};

Post.getInitialProps = async function (context: NextContext) {
  const { id } = context.query;

  const post = getPosts().find((e) => {
    return e.id === id;
  });

  console.log(`Fetched post: ${post ? post.title : ''}`);
  return { post };
};

export default Post;
