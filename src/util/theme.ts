export enum Theme {
  Light = 'light'
, Dark = 'dark'
}

interface Location {
  search?: string;
}

export const applyTheme = (theme: Theme): void => {
  const wrapper = document.querySelector('.wrapper');

  // default is Theme.Light
  const dark = Theme.Dark as string;
  if (theme === Theme.Dark) {
    wrapper.classList.add(dark);
  } else if (wrapper.classList.contains(dark)) {
    wrapper.classList.remove(dark);
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
