import * as H from 'history';
import { render } from 'inferno';
import { h } from 'inferno-hyperscript';

// shared styles
import 'styr';
import './styl/_form.styl';
import './styl/_header.styl';
import './styl/_layout.styl';
import './styl/_shared.styl';
import './styl/_sidebar.styl';
import './styl/_typography.styl';
import './styl/_util.styl';

import './styl/theme/_dark.styl';
import './styl/theme/_light.styl';

import { Container } from './container';

const history = H.createBrowserHistory({
  // https://github.com/ReactTraining/history/pull/614
  // forceRefresh: true
});

render(
  h(Container, { history })
, document.querySelector('#container')
);
