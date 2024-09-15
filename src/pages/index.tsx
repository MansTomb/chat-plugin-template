import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { memo, useEffect, useState } from 'react';

import Data from '@/components/Render';
import { ResponseData, Settings } from '@/type';

const Render = memo(() => {
  const [data, setData] = useState<ResponseData>();
  const [settings, setSettings] = useState<Settings>({ DOCUMENTS_ROOT_FOLDER: '', /* other default settings */ });

  useEffect(() => {
    lobeChat.getPluginMessage().then((e: ResponseData) => {
      setData(e);
    });
  }, []);

  if (!data) {
    return null;
  }
  <Data articles={data.articles} settings={settings} updateSettings={setSettings} fetchData={async() => {}} />
});

export default Render;
