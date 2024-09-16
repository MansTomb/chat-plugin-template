// PresetManager.ts
import { Settings, SettingsPreset } from '@/type';

// Function to save a preset
export const savePreset = async (name: string, settings: Settings): Promise<void> => {
  const presets = await fetchPresets();
  const newPreset: SettingsPreset = { name, settings };

  // Add new preset to existing presets
  presets.push(newPreset);
  await localStorage.setItem('settingsPresets', JSON.stringify(presets));
};

// Function to fetch all presets
export const fetchPresets = async (): Promise<SettingsPreset[]> => {
  const presets = localStorage.getItem('settingsPresets');
  return presets ? JSON.parse(presets) : [];
};

// Function to delete a preset by name
export const deletePreset = async (name: string): Promise<void> => {
  const presets = await fetchPresets();
  const updatedPresets = presets.filter(preset => preset.name !== name);
  await localStorage.setItem('settingsPresets', JSON.stringify(updatedPresets));
};
