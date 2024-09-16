export interface ResponseData {
  articles: Article[];
}

export interface Article {
  path: string; // Path to the article
  title: string; // Title: used as both identifier and display text
  content: string; // Markdown content of the article
}

export interface RequestData {
}

export interface Settings {
  DOCUMENTS_ROOT_FOLDER?: string;
  INCLUDE_FILTER?: string;
  EXCLUDE_FILTER?: string;
}

export interface Setting {
  key: keyof Settings;
  label: string;
  placeholder: string;
}

// Preset.ts
export interface SettingsPreset {
  name: string;  // Name of the preset
  settings: Settings;  // Preset settings of type Settings
}

export interface PresetsState {
  presets: SettingsPreset[];  // Array to hold all saved presets
}
