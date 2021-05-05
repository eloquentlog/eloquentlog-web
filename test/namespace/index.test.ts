import { AxiosResponse } from 'axios';
import * as H from 'history';
import { h } from 'inferno-hyperscript';
import { BrowserRouter } from 'inferno-router';
import {
  isVNode
, findAllInRenderedTree
, renderIntoContainer
, scryRenderedDOMElementsWithClass
, scryRenderedDOMElementsWithTag
} from 'inferno-test-utils';
import { mocked } from 'ts-jest/utils';

import { Theme } from '../../src/util/theme';
import { RouteProps } from '../../src/routing';
import {
  client
, NamespaceIndex
, NamespaceIndexProps } from '../../src/namespace/index';

const mock = mocked(client, true);

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

describe('NamespaceIndex', () => {
  const err = new Error('Unexpected response');

  const uuid = '64e2db2a-26e2-4093-a825-b45850616e79';
  const res: AxiosResponse = {
    data: [{
      namespace: {
        uuid
      , name: 'Default'
      , description: 'This is the default namespace created by the system.'
      , archivedAt: null
      , createdAt: '2021-05-05T07:59:33,802236567+00:00'
      , updatedAt: '2021-05-05T08:00:00,310263008+00:00'
      }
    }]
  , status: 200
  , statusText: 'OK'
  , headers: {}
  , config: {}
  };

  test('does not render any namespace on error', (done) => {
    mock.get = jest.fn();
    mock.get.mockImplementationOnce(() => Promise.reject(err));

    const props = { ...routeProps } as NamespaceIndexProps;
    const renderedTree = renderIntoContainer(
      h(BrowserRouter, {}, h(NamespaceIndex, props))
    );

    setTimeout(() => {
      const predicate = (vNode: any): boolean => vNode.type === NamespaceIndex;
      const nodes = findAllInRenderedTree(renderedTree, predicate);
      const result = nodes.filter((n: any) => isVNode(n));
      expect(result).toHaveLength(1);

      const rows = scryRenderedDOMElementsWithTag(renderedTree, 'tr');
      expect(rows).toHaveLength(1);

      const names = scryRenderedDOMElementsWithClass(renderedTree, 'name');
      expect(names).toHaveLength(0);

      expect(mock.get).toHaveBeenCalledTimes(1);

      done();
    });
  });

  test('renders fetched objects on success', (done) => {
    mock.get = jest.fn();
    mock.get.mockImplementationOnce(() => Promise.resolve(res));

    const props = { ...routeProps } as NamespaceIndexProps;
    const renderedTree = renderIntoContainer(
      h(BrowserRouter, {}, h(NamespaceIndex, props))
    );

    setTimeout(() => {
      const predicate = (vNode: any): boolean => vNode.type === NamespaceIndex;
      const nodes = findAllInRenderedTree(renderedTree, predicate);
      const result = nodes.filter((n: any) => isVNode(n));
      expect(result).toHaveLength(1);

      const rows = scryRenderedDOMElementsWithTag(renderedTree, 'tr');
      expect(rows).toHaveLength(2);

      const names = scryRenderedDOMElementsWithClass(renderedTree, 'name');
      expect(names).toHaveLength(1);
      expect(names[0].innerHTML).toContain(uuid);

      expect(mock.get).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
