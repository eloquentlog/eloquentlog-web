import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';
import Cookie from 'js-cookie';

import { version } from '../../package.json';
import { RouteProps } from '../routing';

import { Theme } from '../util/theme';

export interface SidebarProps extends RouteProps {
  items: VNode[];
}

const inOneYear = 525600; // 60 * 24 * 365

// TODO: read from config.js
const domain = '127.0.0.1';
const secure = false;

const cookieKey = 'console.sidebar';

const readState = (k: string): string | null => {
  const cookie = Cookie.getJSON(k);
  return (cookie && cookie.value || null);
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

const handleThemeLinkClick = (
  props: SidebarProps
, event: Event
): void => {
  event.preventDefault();

  props.setTheme(props.theme === Theme.Light ? Theme.Dark : Theme.Light, true);
};

const setupSidebar = (props: SidebarProps) => {
  const lbl = document.getElementById('sidebar_show_lbl') as HTMLLabelElement;
  if (lbl === null || lbl === undefined) {
    return;
  }
  if (!props.signedIn() || readState(cookieKey) === 'locked') {
    lbl.classList.add('hidden');
  } else {
    lbl.classList.remove('hidden');
  }
};

export const SidebarToggleButton = (): VNode => {
  return h('label#sidebar_show_lbl.hidden', {
    for: 'sidebar_checkbox'
  , title: 'Show Sidebar'
  , dangerouslySetInnerHTML: { __html: '&#9776;' }
  });
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

  const preItems = [
    h('.inner-header', [
      h('span.logo', {}, h('img', {
        src: '/img/wolf-paw-72x72.png'
      , alt: 'Eloquentlog'
      , width: 18
      , height: 18
      }))
    , h('span.title', 'Eloquentlog')
    , h('span.version', `v${version}`)
    ])
  , h('.item.right', nav)
  , h('.item', {}, h(
      'input.search'
    , { type: 'text', placeholder: 'Search' }
    ))
  ];

  const postItems = [
      h('hr.divider')
    , h('.item', [
        'Set theme as'
      , h('a.theme', {
          onClick: linkEvent(props, handleThemeLinkClick)
        }, props.theme === Theme.Light ? 'Dark' : 'Light')
      , '.'
      ])
    , h('.item', {}, h(Link, { to: '/signout' , replace: true}, 'Sign out'))
  ];

  return [
    box
  , h('#sidebar.sidebar', preItems.concat(props.items).concat(postItems))
  ];
};

Sidebar.defaultProps = {};

Sidebar.defaultHooks = {
  onComponentDidMount (_: any, props: SidebarProps): void {
    setupSidebar(props);
  }
, onComponentDidUpdate (
  _lastProps: SidebarProps,
  nextProps: SidebarProps): void {
    setupSidebar(nextProps);
  }
};
