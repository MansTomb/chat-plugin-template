// SettingsForm.tsx
import React, { useState, useEffect } from 'react';
import { savePreset, fetchPresets, deletePreset } from '../services/presets';
import { Settings, Setting, SettingsPreset } from '@/type';
import { Header, Input } from '@lobehub/ui';
import { Button, List } from 'antd';
import { Flexbox } from 'react-layout-kit';

interface SettingsFormProps {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  fetchData: (settings: Settings) => Promise<void>;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, updateSettings, fetchData }) => {
  const [presetName, setPresetName] = useState<string>('');
  const [presets, setPresets] = useState<SettingsPreset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    const loadPresets = async () => {
      const fetchedPresets = await fetchPresets();
      setPresets(fetchedPresets);
    };

    loadPresets();
  }, []);

  const handleSavePreset = async () => {
    await savePreset(presetName, settings);
    setPresetName(''); // Clear input after saving
    setPresets(await fetchPresets()); // Refresh the presets
  };

  const handleLoadPreset = async (preset: SettingsPreset) => {
    setIsLoading(true); // Set loading state to true
    updateSettings(preset.settings); // Load selected preset's settings    
    await fetchData(preset.settings); // Fetch data with new settings
    setIsLoading(false); // Set loading state back to false
  };

  const handleDeletePreset = async (name: string) => {
    setIsLoading(true); // Set loading state to true for delete operation
    await deletePreset(name);
    setPresets(await fetchPresets()); // Refresh the presets
    setIsLoading(false); // Set loading state back to false
  };

  // Configuration for settings fields
  const settingsConfig: Setting[] = [
    { key: 'DOCUMENTS_ROOT_FOLDER', label: 'Document Root Folder', placeholder: 'Enter document root folder' },
    { key: 'INCLUDE_FILTER', label: 'Include Filter (Separated by ;)', placeholder: 'Enter filter here (separated by ; regex supported)' },
    { key: 'EXCLUDE_FILTER', label: 'Exclude Filter (Separated by ;)', placeholder: 'Enter exclude filter here (separated by ; regex supported)' },
  ];

  return (
    <Flexbox gap={16} direction='vertical'>
      {/* Preset Name Input Section */}
      <Flexbox gap={8} direction='horizontal'>
        <Input
          placeholder="Preset Name"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          style={{ width: '200px' }}
        />
        <Button type="primary" onClick={handleSavePreset}>
          Save Preset
        </Button>
      </Flexbox>

      {/* Display Presets List */}
      <List
        bordered
        dataSource={presets}
        renderItem={preset => (
          <List.Item
            actions={[
              <Button 
                type="primary" 
                onClick={() => handleLoadPreset(preset)} 
                loading={isLoading} // Disable while loading
              >
                Load
              </Button>,
              <Button 
                danger 
                onClick={() => handleDeletePreset(preset.name)} 
                loading={isLoading} // Disable while loading
              >
                Delete
              </Button>,
            ]}
          >
            {preset.name} - {preset.settings.DOCUMENTS_ROOT_FOLDER} 
          </List.Item>
        )}
      />

      {/* Input Fields for Actual Settings */}
      <Flexbox gap={8} direction='vertical'>
        {settingsConfig.map(({ key, label, placeholder }) => (
          <Flexbox key={key} gap={8}>
            <label htmlFor={key.toString()} style={{ marginRight: '8px' }}>{label}:</label>
            <Input
              id={key.toString()}
              value={settings[key]}
              placeholder={placeholder}
              onChange={(e) => updateSettings({ ...settings, [key]: e.target.value })}
            />
          </Flexbox>
        ))}
      </Flexbox>
    </Flexbox>
  );
};

export default SettingsForm;
