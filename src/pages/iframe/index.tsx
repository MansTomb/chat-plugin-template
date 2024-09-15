import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { Button } from 'antd';
import { memo, useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';

import Data from '@/components/Render';
import { fetchFolders } from '@/services/folders';
import { ResponseData } from '@/type';

const Render = memo(() => {
  // Initialize rendering state
  const [data, setData] = useState<ResponseData>();

  // Synchronize state from the main application during initialization
  useEffect(() => {
    lobeChat.getPluginMessage().then(setData);
  }, []);

  // Record request parameters
  const [payload, setPayload] = useState<any>();

  useEffect(() => {
    lobeChat.getPluginPayload().then((payload) => {
      if (payload.name === 'fetchFolders') {
        setPayload(payload.arguments);
      }
    });
  }, []);

  const fetchData = async () => {
    const data = await fetchFolders(payload);
    setData(data);
    lobeChat.setPluginMessage(data);
  };

  if (!data) {
    fetchData();
  }

  return data ? (
    <Data {...data}></Data>
  ) : (
    <Center style={{ height: 150 }}>
      <Button
        disabled={!payload}
        onClick={() => {
          console.log('fetchData');
          fetchData();
        }}
        type={'primary'}
      >
        Get Data
      </Button>
    </Center>
  );
});

export default Render;
