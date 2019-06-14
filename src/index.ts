import * as H from 'history';
import { render } from 'inferno';
import { h } from 'inferno-hyperscript';

// shared styles
import 'styr';
import './styl/_form.styl';
import './styl/_layout.styl';
import './styl/_shared.styl';
import './styl/_typography.styl';
import './styl/_util.styl';

// components
import { App } from './app';
import { Header } from './header';

setTimeout((): void => render(
  h(Header),
  document.querySelector('#header')
));

setTimeout((): void => render(
  h(App, { history: H.createBrowserHistory() }),
  document.querySelector('#container')
));
