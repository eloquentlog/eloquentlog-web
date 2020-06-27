import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

enum TokenState {
  Enabled = 'enabled'
, Disabled = 'disabled'
}

const tokenStateFromString = (s: string): TokenState => {
    return s === 'enabled' ? TokenState.Enabled : TokenState.Disabled;
};

const tokenStateToString = (s: TokenState): string => {
    return s === TokenState.Enabled ? 'enabled' : 'disabled';
};

enum AgentType {
  Person = 'person'
, Client = 'client'
}

const agentTypeFromString = (s: string): AgentType => {
    return s === 'person' ? AgentType.Person : AgentType.Client;
};

class TokenObject {
  constructor(
    public uuid: string
  , public name: string
  , public agentType: AgentType
  , public state: TokenState
  , public token: string
  , public revokedAt: string
  , public createdAt: string
  , public updatedAt: string
  ) {}

  static deserialize(obj: any): TokenObject {
    return new TokenObject(
      obj.uuid
    , obj.name
    , agentTypeFromString(obj.agent_type)
    , tokenStateFromString(obj.state)
    , obj.token
    , obj.revoked_at
    , obj.created_at
    , obj.updated_at
    );
  }
}

interface TokenProps {
  index: number;
  attribute: TokenObject;
  activate: (props: TokenProps) => void;
  toggleState: (props: TokenProps) => void;
}

const handleActivate = (
  props: TokenProps
, event: Event
): void => {
  event.preventDefault();

  const t = event.currentTarget as HTMLElement;
  try {
    t.setAttribute('disabled', '1');
    props.activate(props);
  } finally {
    t.removeAttribute('disabled');
    t.blur();
  }
};

const handleToggle = (
  props: TokenProps
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

const Token = (
  props: TokenProps
): VNode => {
  const klass = tokenStateToString(props.attribute.state);

  return h(`tr.${klass}`, [
    h('td.name', props.attribute.name)
  , h('td.created', props.attribute.createdAt)
  , h('td.state', props.attribute.state)
  , h('td.action', [
      (props.attribute.token) ? '' :
      h('button.primary.flat.button', {
        onClick: linkEvent(props, handleActivate)
      }, 'Activate')
    , h('button.secondary.flat.button', {
        onClick: linkEvent(props, handleToggle)
      }, klass === 'enabled' ? 'Disable' : 'Enable')
    ])
  ]);
};

Token.defaultProps = {
  index: 0
, attribute: new TokenObject(
    undefined // uuid
  , undefined // name
  , AgentType.Person // agentType
  , TokenState.Disabled // state
  , undefined // token
  , null // revokedAt
  , undefined // createdAt
  , undefined // updatedAt
  )
};

export {
  Token
, TokenObject
, TokenProps
, TokenState
};
