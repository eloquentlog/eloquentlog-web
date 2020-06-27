import { Component, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { RouteProps } from '../routing';
import { getClient, Headers } from '../util/client';
import { renderTitle } from '../prtl/title';
import { Token, TokenObject, TokenProps, TokenState } from '../prtl/token';

import '../styl/settings/access_token.styl';

interface AccessTokenProps extends RouteProps {}

interface AccessTokenState {
  tokens: { attribute: TokenObject }[];
}

// tslint:disable-next-line
const client = getClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [401, 422].some((n: number): boolean => n === status);
});

export class AccessToken extends
  Component<AccessTokenProps, AccessTokenState> {
  constructor(props: AccessTokenProps) {
    super(props);

    this.state = {
      tokens: []
    };
  }

  public componentDidMount() {
    document.title = 'Access Token - ' + document.title;
    this.fetchAccessTokens();
  }

  private fetchAccessTokens() {
    const t = this.props.getToken();
    client.get('/access_token/lrange/person/0/0', {
      withCredentials: true
    , transformRequest: [(_: any, headers: Headers) => {
        headers.Authorization = `Bearer ${t}`;
      }]
    })
    .then((res: any): void => {
      if (res.status === 200 && Array.isArray(res.data)) {
        const data = res.data.map((obj: any) => {
          return obj.access_token ?
            { attribute: TokenObject.deserialize(obj.access_token) } : null;
        });
        this.setState({ tokens: data });
        return;
      }
      throw new Error(`unexpected response: ${res}`);
    })
    .catch((err: any): void => {
      // TODO
      console.log(err);
    });
  }

  private activate(props: TokenProps) {
    const t = this.props.getToken();
    const uuid = props.attribute.uuid;

    client.patch(`/access_token/dump/${uuid}`, {}, {
      withCredentials: true
    , transformRequest: [(data: any, headers: Headers) => {
        headers.Authorization = `Bearer ${t}`;
        return JSON.stringify(data);
      }]
    })
    .then((res: any): void => {
      if (res.status === 200) {
        const data = res.data;
        // TODO
        console.log(data);
        return;
      }
      throw new Error(`unexpected response: ${res}`);
    })
    .catch((err: any): void => {
      // TODO
      console.log(err);
    });
  }

  private toggleState(props: TokenProps) {
    const t = this.props.getToken();
    const uuid = props.attribute.uuid;
    // next
    const state = (
      props.attribute.state === TokenState.Disabled ?
        TokenState.Enabled : TokenState.Disabled
    );

    client.patch(`/access_token/hset/${uuid}/state`, {}, {
      withCredentials: true
    , transformRequest: [(data: any, headers: Headers) => {
        headers.Authorization = `Bearer ${t}`;
        data = {
          'access_token': {
            'state': state
          }
        , ...data
        };
        return JSON.stringify(data);
      }]
    })
    .then((res: any): void => {
      if (res.status === 200) {
        const data = res.data;
        if (data.access_token === 1) {
          props.attribute.state = state;
          const tokens = this.state.tokens;
          tokens[props.index] = { attribute: props.attribute };
          this.setState({ tokens });
        }
        return;
      }
      throw new Error(`unexpected response: ${res}`);
    })
    .catch((err: any): void => {
      // TODO
      console.log(err);
    });
  }

  public render(): VNode {
    return h('#access_token.content', {},
      h('.access-token.grid', {},
        h('.row', {},
          h(`.column-10.offset-3
.column-v-12.offset-v-2
.column-l-10.offset-l-3
.column-m-16`, {},
            h('.transparent.box', [
              renderTitle()
            , h('.container', [
                h('h4.header', {}, 'Token')
              , h('h6.type', 'Personal Access Token')
              , h('table.personal-access-token', [
                  h('thead', {}, h('tr', [
                    h('th', {}, 'Name')
                  , h('th', {}, 'Created At')
                  , h('th', {}, 'State')
                  , h('th', {}, '')
                  ]))
                , h('tbody', this.state.tokens.map(
                    (t: any, i: number) => {
                      return h(Token, {
                        index: i
                      , toggleState: this.toggleState.bind(this)
                      , activate: this.activate.bind(this)
                      , ...t
                      });
                    }
                  ))
                ])
              ])
            ])
          )
        )
      )
    );
  }
}
