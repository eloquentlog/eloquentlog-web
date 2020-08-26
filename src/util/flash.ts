import * as H from 'history';

interface FlashLocationState extends H.LocationState {
  flash: string;
}

export const getFlashMessage = (history: H.History): string => {
  const { location } = history;
  if ((typeof location.state) === 'object' &&
     location.state.hasOwnProperty('flash')) {
    return (location.state as FlashLocationState).flash;
  }
  return undefined;
};

