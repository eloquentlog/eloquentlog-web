import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { RouteProps } from '../../routing';
import {
  AccessTokenObject
, AccessTokenState as State
, accessTokenStateToString as ToString
, AgentType
} from './data';

export interface PersonalAccessTokenProps extends RouteProps {
  index: number;
  attribute: AccessTokenObject;
  concealToken: (props: PersonalAccessTokenProps) => void;
  toggleState: (props: PersonalAccessTokenProps) => void;
}

const handleConceal = (
  props: PersonalAccessTokenProps
, event: Event
): void => {
  event.preventDefault();

  const t = event.currentTarget as HTMLElement;
  try {
    t.setAttribute('disabled', '1');
    props.concealToken(props);
  } finally {
    t.removeAttribute('disabled');
    t.blur();
  }
};

const handleToggle = (
  props: PersonalAccessTokenProps
, event: Event
): void => {
  event.preventDefault();

  const t = event.currentTarget as HTMLElement;
  try {
    t.setAttribute('disabled', '1');
    props.toggleState(props);
  } finally {
    t.removeAttribute('disabled');
    t.blur();
  }
};

export const PersonalAccessToken = (
  props: PersonalAccessTokenProps
): VNode => {
  const klass = ToString(props.attribute.state);

  return h(`p.${klass}`, [
    h('span.name', props.attribute.name)
  , h('span.created', props.attribute.createdAt)
  , h('button.primary.flat.button', {
      onClick: linkEvent(props, handleConceal)
    }, 'Conceal')
  , h('button.secondary.flat.button', {
      onClick: linkEvent(props, handleToggle)
    }, klass === 'enabled' ? 'Disabled' : 'Enabled')
  ]);
};

PersonalAccessToken.defaultProps = {
  index: 0
, attribute: new AccessTokenObject(
    undefined // uuid
  , undefined // name
  , AgentType.Person // agentType
  , State.Disabled // state
  , undefined // token
  , null // revokedAt
  , undefined // createdAt
  , undefined // updatedAt
  )
};
