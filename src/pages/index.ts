import * as h from 'react-hyperscript';

import Link, { LinkProps } from 'next/link';

import Layout from '../components/layout';

export interface Post {
  id: string;
  title: string;
  description: string;
}

function getPosts(): Post[] {
  return [
    { id: 'das-ist-ein-test', title: 'Das ist ein Test', description: '...' }
  ];
}

interface PostLinkProps {
  post: Post;
}

const PostLink = function ({ post }: PostLinkProps) {
  const postProps: LinkProps = {
    as: `/p/${post.id}`
  , href: `/post?id=${post.id}`
  , children: h('a', post.title)
  };

  return h('li', [
    h(Link, postProps)
  ]);
};

export interface IndexProps {
  posts: Post[];
}

const Index = function (props: IndexProps) {
  return h(Layout, {
    children: [
      h('h1', {key: 'title'}, 'Posts')
    , h('ul', {key: 'posts'}, props.posts.map((post) => {
        return h(PostLink, {key: post.id, post});
      }))
    ]
  });
};

Index.getInitialProps = async function () {
  const data = getPosts();

  console.log(`Show data fetched. Count: ${data.length}`);
  return {
    posts: data
  };
};

export default Index;
