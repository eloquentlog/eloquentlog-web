import * as H from 'history';
import { render } from 'inferno';
import { h } from 'inferno-hyperscript';

// shared styles
import 'styr';
import './styl/_form.styl';
import './styl/_header.styl';
import './styl/_layout.styl';
import './styl/_shared.styl';
import './styl/_typography.styl';
import './styl/_util.styl';

import './styl/theme/_dark.styl';
import './styl/theme/_light.styl';

// components
import { App } from './app';

setTimeout((): void => render(
  h(App, { history: H.createBrowserHistory() }),
  document.querySelector('#container')
));
