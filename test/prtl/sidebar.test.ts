import * as H from 'history';
import * as Cookies from 'js-cookie';
import { h } from 'inferno-hyperscript';
import { BrowserRouter } from 'inferno-router';
import {
  renderIntoContainer
, scryRenderedDOMElementsWithTag
} from 'inferno-test-utils';
import { mocked } from 'ts-jest/utils';

import { Theme } from '../../src/util/theme';
import { RouteProps } from '../../src/routing';
import { Sidebar, SidebarProps } from '../../src/prtl/sidebar';

const mockedCookies = mocked(Cookies, true);

describe('Sidebar', () => {
  const history = H.createBrowserHistory({
    forceRefresh: true
  });

  const routeProps: RouteProps = {
    history
  , signedIn: () => { return true; }
  , theme: null
  , getToken: () => { return ''; }
  , delStamp: () => { return; }
  , getStamp: () => { return ''; }
  , putStamp: (_: string) => { return ''; }
  , setStamp: (_: string) => { return 1; }
  , handleTheme: () => { return 1; }
  , getTheme: () => { return Theme.Dark; }
  , setTheme: (_theme: Theme, _update: boolean) => { return 1; }
  };

  beforeEach(() => {
    mockedCookies.getJSON = jest.fn();
    mockedCookies.getJSON.mockImplementationOnce(() => ({
      value: ''
    }));
  });

  afterEach(() => {
    mockedCookies.getJSON.mockReset();
  });

  test('has valid classNames', () => {
    const props = { ...routeProps } as SidebarProps;
    const [checkbox, sidebar] = Sidebar(props);
    expect(checkbox.className).toBe('sidebar-checkbox');
    expect(sidebar.className).toBe('sidebar');
  });

  test('renders items', () => {
    const props = { ...routeProps } as SidebarProps;
    const renderedTree = renderIntoContainer(
      h(BrowserRouter, {}, h(Sidebar, props))
    );
    const result = scryRenderedDOMElementsWithTag(renderedTree, 'span');
    expect(result).toHaveLength(3);
  });
});
