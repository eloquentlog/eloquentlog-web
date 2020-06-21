import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';
import Cookie from 'js-cookie';

interface SidebarProps {
  history: H.History;
  signedIn: () => boolean;
}

const inOneYear = 525600; // 60 * 24 * 365

// TODO: read from config.js
const domain = '127.0.0.1';
const secure = false;

const cookieKey = 'console.sidebar';

const readState = (k: string): string | null => {
  const v = Cookie.getJSON(k).value;
  return v;
};

const saveState = (k: string, state: string) => {
  let v = readState(k);
  if (typeof v === 'undefined' || v === null || v !== state) {
    v = state;
  }
  const value = {
    value: v
  , limit: new Date((new Date()).getTime() + inOneYear * 864e+5)
  };

  let attributes: Cookie.CookieAttributes = {
    domain
  , expires: inOneYear
  , secure
  };
  // See: https://github.com/js-cookie/js-cookie/issues/276
  attributes = Object.assign(attributes, {
    sameSite: 'Strict'
  });
  Cookie.set(k, value, attributes as any);
};

const handleHideClick = (_: SidebarProps, event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  const target = event.target as HTMLInputElement;
  target.blur();

  const box = document.getElementById('sidebar_checkbox') as HTMLInputElement
      , lbl = document.getElementById('sidebar_show_lbl') as HTMLLabelElement
      ;

  lbl.classList.remove('hidden');
  box.checked = false;
};

const handleHoldClick = (_: SidebarProps, event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  const target = event.target as HTMLInputElement;
  target.blur();

  const box = document.getElementById('sidebar_checkbox') as HTMLInputElement
      , btn = document.getElementById('sidebar_hide_btn') as HTMLInputElement
      , lbl = document.getElementById('sidebar_show_lbl') as HTMLLabelElement
      ;

  lbl.classList.add('hidden');
  box.checked = true;

  const isPinned = box.classList.contains('pinned');
  if (isPinned === null || typeof isPinned === 'undefined' ||
      isPinned === false)  {
    saveState(cookieKey, 'locked');

    btn.disabled = true;

    box.classList.add('pinned');
    target.innerHTML = 'Unpin';
  } else {
    saveState(cookieKey, 'unlocked');

    btn.disabled = false;
    btn.removeAttribute('disabled');

    box.classList.remove('pinned');
    target.innerHTML = 'Pin';
  }
};

const setupSidebar = () => {
  const lbl = document.getElementById('sidebar_show_lbl') as HTMLLabelElement;
  if (lbl === null || lbl === undefined) {
    return;
  }

  if (readState(cookieKey) === 'locked') {
    lbl.classList.add('hidden');
  } else {
    lbl.classList.remove('hidden');
  }
};

export const Sidebar = (props: SidebarProps): VNode[] => {
  if (!props.signedIn()) {
    return [];
  }

  let box = null
    , nav = []
    ;
  if (readState(cookieKey) === 'locked') {
    box = h('input#sidebar_checkbox.sidebar-checkbox.pinned', {
      type: 'checkbox'
    , checked: 'checked'
    });
    nav = [
      h('button#sidebar_hide_btn.flat.grouped.button', {
        title: 'Hide Sidebar'
      , disabled: 'disabled'
      , onClick: linkEvent(props, handleHideClick)
      }, 'Hide')
    , h('button#sidebar_hold_btn.flat.grouped.button', {
        title: 'Unpin Sidebar'
      , onClick: linkEvent(props, handleHoldClick)
      }, 'Unpin')
    ];
  } else {
    box = h('input#sidebar_checkbox.sidebar-checkbox', {
      type: 'checkbox'
    });
    nav = [
      h('button#sidebar_hide_btn.flat.grouped.button', {
        title: 'Hide Sidebar'
      , onClick: linkEvent(props, handleHideClick)
      }, 'Hide')
    , h('button#sidebar_hold_btn.flat.grouped.button', {
        title: 'Unpin Sidebar'
      , onClick: linkEvent(props, handleHoldClick)
      }, 'Pin')
    ];
  }

  return [
    box
  , h('#sidebar.sidebar', {}, [
      h('.inner-header', 'Eloquentlog')
    , h('.item.right', nav)
    , h('.item', {}, h(Link, { to: '/' }, 'Namespaces'))
    , h('.item', {}, h(Link, { to: '/settings/token' }, 'Settings'))
    ])
  ];
};

Sidebar.defaultProps = {};

Sidebar.defaultHooks = {
  onComponentDidMount (_: any): void {
    setupSidebar();
  }
, onComponentDidUpdate (_: any): void {
    setupSidebar();
  }
};
