import { h } from 'inferno-hyperscript';

import icon from '../lib/icon';

export interface IconProps {
  name: string;
}

export const Icon = (props: IconProps) => {
  const klass = props.name ? `.${props.name}` : '';
  return h(`span.icon${klass}`, {
    dangerouslySetInnerHTML: { __html: icon[props.name].toSVG() }
  , ...props
  });
};
