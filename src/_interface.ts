import * as H from 'history';

export interface BaseProps {
  getToken: () => string;
  history: H.History;
}
