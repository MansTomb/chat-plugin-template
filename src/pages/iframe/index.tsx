import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { Button } from 'antd';
import { memo, useEffect, useState } from 'react';

import Data from '@/components/Render';
import { fetchDocuments } from '@/services/documents';
import { ResponseData, Settings } from '@/type';
import { Center } from 'react-layout-kit';

const Render = memo(() => {
  const [data, setData] = useState<ResponseData>();
  const [payload, setPayload] = useState<any>();
  const [settings, setSettings] = useState<Settings>({ DOCUMENTS_ROOT_FOLDER: '', /* other default settings */ });

  // Fetch initial settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const settingsData = await lobeChat.getPluginSettings() as Settings;
      setSettings(settingsData);
    };
    fetchSettings();
  }, []);

  // Synchronize state from the main application during initialization
  useEffect(() => {
    lobeChat.getPluginMessage().then(setData);
  }, []);

  // Fetch payload data
  useEffect(() => {
    lobeChat.getPluginPayload().then((payload) => {
      if (!payload) return;
      if (payload.name === 'fetchDocuments') {
        setPayload(payload.arguments);
      }
    });
  }, []);

  const fetchData = async () => {
    const data = await fetchDocuments(payload, settings); // Incorporate settings into fetch
    setData(data);
    lobeChat.setPluginMessage(data);
  };

  return data ? (
    <Data articles={data.articles} settings={settings} updateSettings={setSettings} fetchData={fetchData} />
  ) : (
    <Center style={{ height: 600 }}>
      <Button onClick={fetchData} type={'primary'}>
        Get Data
      </Button>
    </Center>
  );
});

export default Render;
