import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

export const renderMessage = (
  message: string
, context: string='success'
): VNode => {
  return (context === undefined) ?
    h('#message.message.hidden', { role: 'alert' }) :
    h(`#message.message.${context}`, { role: 'alert' }, h('p', {}, message));
};
