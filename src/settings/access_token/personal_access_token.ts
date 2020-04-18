import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { BaseProps } from '../../_interface';
import {
  AccessTokenObject
, AccessTokenState as State
, accessTokenStateToString as ToString
, AgentType
} from './data';

export interface PersonalAccessTokenProps extends BaseProps {
  index: number;
  attribute: AccessTokenObject;
  toggleState: (props: PersonalAccessTokenProps) => void;
}

const handleClick = (
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
  const btnText = (klass === 'enabled' ? 'Disable' : 'Enable');

  return h(`p.${klass}`, [
    h('span.name', props.attribute.name)
  , h('span.created', props.attribute.createdAt)
  , h('button.primary.flat.button', {
      onClick: linkEvent(props, handleClick)
    }, btnText)
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
