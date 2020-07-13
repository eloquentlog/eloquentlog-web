import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';

import { truncate } from '../util/text';

enum NamespaceState {}

class NamespaceObject {
  constructor(
    public uuid: string
  , public name: string
  , public description: string
  , public archivedAt: string
  , public createdAt: string
  , public updatedAt: string
  ) {}

  static deserialize(obj: any): NamespaceObject {
    return new NamespaceObject(
      obj.uuid
    , obj.name
    , obj.description
    , obj.archived_at
    , obj.created_at
    , obj.updated_at
    );
  }
}

interface NamespaceProps {
  index: number;
  attribute: NamespaceObject;
}

const Namespace = (
  props: NamespaceProps
): VNode => {
  return h(`tr`, [
    h('td.name', {}, 
      h(Link, {
        to: `/namespace/${props.attribute.uuid}`
      , className: 'link'
      }, props.attribute.name)
    )
  , h('td.description', truncate(props.attribute.description, 9))
  , h('td.created-at', props.attribute.createdAt)
  , h('td.action', [
      h(Link, {
        to: `/namespace/${props.attribute.uuid}/edit`
      , className: 'link'
      }, 'Edit')
    ])
  ]);
};

Namespace.defaultProps = {
  index: 0
, attribute: new NamespaceObject(
    undefined // uuid
  , undefined // name
  , undefined // description
  , null // archivedAt
  , undefined // createdAt
  , undefined // updatedAt
  )
};

export {
  Namespace
, NamespaceObject
, NamespaceProps
, NamespaceState
};
