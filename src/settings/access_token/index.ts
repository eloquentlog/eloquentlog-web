import { Component, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { BaseProps } from '../../_interface';
import { getClient, Headers } from '../../util/client';
import { renderTitle } from '../../prtl/title';
import { AccessTokenObject, AccessTokenState as State } from './data';
import {
  PersonalAccessToken
, PersonalAccessTokenProps
} from './personal_access_token';

interface AccessTokenProps extends BaseProps {}

interface AccessTokenState {
  personalAccessTokens: { attribute: AccessTokenObject }[];
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
      personalAccessTokens: []
    };
  }

  public componentDidMount() {
    document.title = 'Access Token - ' + document.title;
    this.fetchPersonalAccessTokens();
  }

  private fetchPersonalAccessTokens() {
    const t = this.props.getToken();
    client.get('/access_token/lrange/person/0/0', {
      withCredentials: true
    , transformRequest: [(_: any, headers: Headers) => {
        headers.Authorization = `Bearer ${t}`;
      }]
    })
    .then((res: any): void => {
      if (res.status === 200 && Array.isArray(res.data)) {
        const data = res.data.map((obj: object) => {
          return { attribute: AccessTokenObject.deserialize(obj) };
        });
        this.setState({ personalAccessTokens: data });
        return;
      }
      throw new Error(`unexpected response: ${res}`);
    })
    .catch((err: any): void => {
      // TODO
      console.log(err);
    });
  }

  private toggleState(props: PersonalAccessTokenProps) {
    const t = this.props.getToken();
    const uuid = props.attribute.uuid;
    // next
    const state = (
      props.attribute.state === State.Disabled ? State.Enabled : State.Disabled
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
          const tokens = this.state.personalAccessTokens;
          tokens[props.index] = { attribute: props.attribute };
          this.setState({ personalAccessTokens: tokens });
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
          h(`.column-6.offset-5
  .column-v-8.offset-v-4
  .column-l-10.offset-l-3
  .column-m-16`, {},
            h('.transparent.box', [
              renderTitle()
            , h('.container', [
                h('h4.header', {}, 'Token')
              , h('h6.type', 'Personal Access Token')
              , h('ul.personal-access-token-list', [
                  h('li', this.state.personalAccessTokens.map(
                    (t: any, i: number) => {
                      return h(PersonalAccessToken, {
                        index: i
                      , toggleState: this.toggleState.bind(this)
                      , ...t
                      , ...this.props
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
