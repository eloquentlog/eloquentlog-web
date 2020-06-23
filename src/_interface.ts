import * as H from 'history';

export interface RouteProps {
  getToken: () => string;
  history: H.History;
}
