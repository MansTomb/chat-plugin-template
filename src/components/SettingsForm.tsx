// SettingsForm.tsx
import React from 'react';
import { Input } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';
import { Setting, Settings } from '@/type';

interface SettingsFormProps {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  settingsConfig: Setting[];
}

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, updateSettings, settingsConfig }) => {
  const handleChange = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateSettings({ ...settings, [key]: value });
  };

  return (
    <Flexbox gap={8}>
      {settingsConfig.map(({ key, label, placeholder }) => (
        <Flexbox key={key}>
          <label htmlFor={key.toString()}>{label}:</label>
          <Input
            id={key.toString()}
            value={settings[key]}
            onChange={handleChange(key)}
            placeholder={placeholder}
          />
        </Flexbox>
      ))}
    </Flexbox>
  );
};

export default SettingsForm;
