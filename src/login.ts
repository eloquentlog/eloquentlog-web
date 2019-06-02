import { linkEvent } from 'inferno';
import { h } from 'inferno-hyperscript';

const handleSubmit = (props: any, event: Event) => {
  event.preventDefault();
  console.log(props);
};

export const Login = (props: any) => {
  return h('.content', [
    h('form', {
      noValidate: true
    , onSubmit: linkEvent(props, handleSubmit)
    }, [
      h('.control-group', [
        h('label.label', { for: 'username' }, 'Username')
      , h('input#username', { type: 'email', name: 'username' })
      ])
    , h('.control-group', [
        h('label.label', { for: 'password' }, 'Password')
      , h('input#password', { type: 'password', name: 'password' })
      ])
    , h('button#submit', { type: 'submit' }, 'Login')
    ])
  ]);
};

Login.defaultHooks = {
  onComponentDidMount (_: any) {
    document.title = 'Login - ' + document.title;
  }
};
