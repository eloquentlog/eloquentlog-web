import * as H from 'history';
import { Component as BaseComponent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { BrowserRouter } from 'inferno-router';

import { applyTheme, matchTheme, Theme } from './util/theme';
import { readToken, saveToken } from './util/token';

import { Routing } from './routing';

export interface ContainerProps {
  history: H.History;
}

interface ContainerState {
  stamp?: string;
  theme?: Theme;
}

export class Container extends BaseComponent<ContainerProps, ContainerState> {
  constructor (props: ContainerProps) {
    super(props);

    this.state = {
      stamp: undefined
    , theme: Theme.Light
    };

    this.handleTheme = this.handleTheme.bind(this);
    this.getTheme = this.getTheme.bind(this);
    this.setTheme = this.setTheme.bind(this);
    this.getToken = this.getToken.bind(this);
    this.delStamp = this.delStamp.bind(this);
    this.getStamp = this.getStamp.bind(this);
    this.putStamp = this.putStamp.bind(this);
    this.setStamp = this.setStamp.bind(this);
    this.signedIn = this.signedIn.bind(this);
  }

  public componentWillMount (): void {
    this.state.stamp = this.getStamp();
    this.state.theme = this.getTheme();
  }

  public render (): VNode {
    return h(BrowserRouter, {}, h(Routing, {
      history: this.props.history
    , theme: this.state.theme
    , handleTheme: this.handleTheme
    , getTheme: this.getTheme
    , setTheme: this.setTheme
    , getToken: this.getToken
    , delStamp: this.delStamp
    , getStamp: this.getStamp
    , putStamp: this.putStamp
    , setStamp: this.setStamp
    , signedIn: this.signedIn
    }));
  }

  private handleTheme (): void {
    const { location } = this.props.history;

    matchTheme(
      location
    , (): void => this.setTheme(Theme.Dark, false)
    , (): void => this.setTheme(Theme.Light, false)
    );
    applyTheme(this.state.theme);
  }

  private getTheme (): Theme {
    let theme = window.localStorage.getItem('theme');
    if (theme === null) {
      theme = Theme.Light;
    }
    return theme as Theme;
  }

  private setTheme (theme: Theme, update = true): void {
    window.localStorage.setItem('theme', theme);
    if (!update) {
      this.state.theme = theme;
    } else {
      this.setState({ theme });
    }
  }

  private getToken(): string {
    const token = readToken();
    if (token !== undefined) {
      return token.value;
    }
    return undefined;
  }

  private getStamp (): string {
    const token = readToken();
    // TODO: consider this (for now, just return the limit as stamp)
    if (token !== undefined && token.limit !== undefined) {
      return token.limit.toString();
    }
    return undefined;
  }

  private putStamp (value: string): string {
    saveToken(value);
    return this.getStamp();
  }

  private delStamp (): void {
    this.state.stamp = this.putStamp(undefined);
  }

  private setStamp (stamp: string): void {
    this.state.stamp = stamp;
  }

  private signedIn (): boolean {
    return (this.state.stamp !== null && this.state.stamp !== undefined);
  }
}
