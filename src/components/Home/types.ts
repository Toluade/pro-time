export type DisplayModes = {
  systemDefault: string;
  lightMode: string;
  darkMode: string;
};

export type SettingsProviderType = {
  displayModes?: DisplayModes;
  displayPreference?: string;
  setDisplayPreference?: any;
};
