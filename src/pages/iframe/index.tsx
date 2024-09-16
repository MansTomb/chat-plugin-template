import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { memo, useEffect, useState } from 'react';

import Data from '@/components/Render';
import { fetchDocuments, formatData, subscribeToDocumentUpdates } from '@/services/documents';
import { ResponseData, Settings } from '@/type';

const Render = memo(() => {
  const [data, setData] = useState<ResponseData>();
  const [payload, setPayload] = useState<any>();
  const [ignoreUpdatesWhileFetching, setIgnoreUpdatesWhileFetching] = useState<Boolean>();
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
    setIgnoreUpdatesWhileFetching(true);
    setData(undefined);
    const data = await fetchDocuments(payload, settings); // Incorporate settings into fetch
    setData(data);
    setIgnoreUpdatesWhileFetching(false);
    lobeChat.setPluginMessage(formatData(data));
  };

  // Establish EventSource connection
  useEffect(() => {
    console.log('subscribing to document updates');

    const unsubscribe = subscribeToDocumentUpdates(
      (newDocument) => {
        if (ignoreUpdatesWhileFetching) return;

        const newData = {
          ...data,
          articles: [...data?.articles ? data.articles : [], newDocument],
        };

        setData(newData);
        lobeChat.setPluginMessage(formatData(newData));
      },
      
      (updatedDocument) => {
        if (ignoreUpdatesWhileFetching) return;

        const newData = {
          ...data,
          articles: [
            ...data?.articles ? data.articles.filter((doc) => doc.path !== updatedDocument.path) : [],
            updatedDocument,
          ],
        };
        setData(newData);
        lobeChat.setPluginMessage(formatData(newData));
    },

    (deletedDocument) => {
      if (ignoreUpdatesWhileFetching) return;

      const newData = {
        ...data,
        articles: data?.articles ? data.articles.filter((doc) => doc.path !== deletedDocument.path) : [],
      };
      setData(newData)
      lobeChat.setPluginMessage(formatData(newData));
    });

    return unsubscribe;
  }, []);

  return (
    <Data
      articles={!data ? [] : data.articles}
      settings={settings}
      updateSettings={setSettings}
      fetchData={fetchData}
    />
  );
});

export default Render;
