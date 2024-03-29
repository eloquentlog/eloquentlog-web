import * as H from 'history';
import Cookies from 'js-cookie';

import { tokenKey } from '../src/util/token';
import { Container, ContainerProps } from '../src/container';

jest.mock('js-cookie', () => {
  return {
    default: {
      get: jest.fn()
    }
  };
});

const mockedCookies = jest.mocked(Cookies);

describe('Container', () => {

  const history = H.createBrowserHistory({
    forceRefresh: true
  });

  const containerProps: ContainerProps = {
    history
  };

  afterEach(() => {
    mockedCookies.get.mockReset();
  });

  test('getStamp via children\'s props returns undefined', () => {
    mockedCookies.get.mockImplementationOnce(() => ({}));

    const props = { ...containerProps } as ContainerProps;
    const container = new Container(props).render();
    const router = container.props.children;
    expect(router.props.getStamp()).toBeUndefined();
  });

  test('getStamp via children\'s props returns a valid limit', () => {
    const limit = (new Date()).toString();
    mockedCookies.get.mockImplementationOnce(() => ({
      [tokenKey]: JSON.stringify({
        limit
      , value: ''
      })
    }));

    const props = { ...containerProps } as ContainerProps;
    const container = new Container(props).render();
    const router = container.props.children;
    expect(router.props.getStamp()).toBe(limit);
  });
});
