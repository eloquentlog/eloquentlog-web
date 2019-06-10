import * as H from 'history';
import { render } from 'inferno';
import { h } from 'inferno-hyperscript';

// shared styles
import 'styr';
import './styl/_common.styl';

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
