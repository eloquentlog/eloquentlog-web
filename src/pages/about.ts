import h from 'react-hyperscript';

import Layout from '../components/layout';

const Index = function () {
  return h(Layout, {
    children: h('p', 'This is the about page')
  });
};

export default Index;
