import { Settings, SettingsPreset } from '@/type';

// Function to save a preset, overriding if the name already exists
export const savePreset = async (name: string, settings: Settings): Promise<void> => {
  const presets = await fetchPresets(); // Fetch existing presets
  const newPreset: SettingsPreset = { name, settings };

  // Check if a preset with the same name already exists
  const index = presets.findIndex(preset => preset.name === name);
  if (index !== -1) {
    // If it exists, replace the existing preset with the new one
    presets[index] = newPreset;
  } else {
    // If it doesn't exist, add the new preset
    presets.push(newPreset);
  }

  // Save updated presets back to localStorage
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
