export enum Theme {
  Light = 'light'
, Dark = 'dark'
}

interface Location {
  search?: string;
}

export const applyTheme = (theme: Theme): void => {
  const body = document.querySelector('body');

  // default is Theme.Light
  const dark = Theme.Dark as string;
  const light = Theme.Light as string;

  if (theme === Theme.Dark) {
    body.classList.remove(light);
    body.classList.add(dark);
  } else if (theme === Theme.Light) {
    body.classList.remove(dark);
    body.classList.add(light);
  }
};

export const matchTheme = (
  location: Location
, darkThemeCallback: () => void
, lightThemeCallback: () => void
): void => {
  const { search } = location;

  if (search === ('?theme=' + Theme.Dark as string)) {
    darkThemeCallback();
  } else if (search === ('?theme=' + Theme.Light as string)) {
    lightThemeCallback();
  }
};
