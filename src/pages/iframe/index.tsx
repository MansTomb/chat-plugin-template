import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { memo, useEffect, useState } from 'react';

import Data from '@/components/Render';
import { fetchDocuments, formatData } from '@/services/documents';
import { ResponseData, Settings } from '@/type';

const Render = memo(() => {
  const [data, setData] = useState<ResponseData>();
  const [payload, setPayload] = useState<any>();
  const [settings, setSettings] = useState<Settings>({});

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
    // clear data
    setData(undefined);
    const data = await fetchDocuments(payload, settings); // Incorporate settings into fetch
    setData(data);
    lobeChat.setPluginMessage(formatData(data));
  };

  return (<Data articles={!data ? [] : data.articles} settings={settings} updateSettings={setSettings} fetchData={fetchData} />);
});

export default Render;
