import { mount, shallow } from 'enzyme';

import Index, { IndexProps } from '../../../src/pages/index';

test('Index has the page title', () => {
  const props: IndexProps = {posts: [
    {id: '1', title: '', description: ''}
  ]};
  const result = shallow(Index(props));
  expect(result.find('h1').text().includes('Posts')).toBeTruthy();
});

test('Index has a post title as link', () => {
  const props: IndexProps = {posts: [
    {id: '1', title: 'Post Title', description: ''}
  ]};
  const result = mount(Index(props));
  expect(result.find('ul li a').text().includes('Post Title')).toBeTruthy();
});
