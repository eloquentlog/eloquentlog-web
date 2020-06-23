import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

export const renderMessage = (
  message: string
, context: string='success'
): VNode => {
  let ctx = context;
  if (message === null || message === undefined || message === '') {
    ctx = undefined;
  }
  return (ctx === undefined) ?
    h('#message.message.hidden', { role: 'alert' }) :
    h(`#message.message.${ctx}`, { role: 'alert' }, h('p', {}, message));
};
