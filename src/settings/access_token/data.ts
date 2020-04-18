export enum AccessTokenState {
  Enabled = 'enabled'
, Disabled = 'disabled'
}

export const accessTokenStateFromString = (s: string): AccessTokenState => {
    return s === 'enabled' ?
        AccessTokenState.Enabled : AccessTokenState.Disabled;
};

export const accessTokenStateToString = (s: AccessTokenState): string => {
    return s === AccessTokenState.Enabled ? 'enabled' : 'disabled';
};

export enum AgentType {
  Person = 'person'
, Client = 'client'
}

export const agentTypeFromString = (s: string): AgentType => {
    return s === 'person' ? AgentType.Person : AgentType.Client;
};

export const agentTypeToString = (t: AgentType): string => {
    return t === AgentType.Person ? 'person' : 'client';
};

export class AccessTokenObject {
  constructor(
    public uuid: string
  , public name: string
  , public agentType: AgentType
  , public state: AccessTokenState
  , public token: string
  , public revokedAt: string
  , public createdAt: string
  , public updatedAt: string
  ) {}

  static deserialize(json: any): AccessTokenObject {
    const obj = json.access_token;
    return new AccessTokenObject(
      obj.uuid
    , obj.name
    , agentTypeFromString(obj.agent_type)
    , accessTokenStateFromString(obj.state)
    , obj.token
    , obj.revoked_at
    , obj.created_at
    , obj.updated_at
    );
  }
}
