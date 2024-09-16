import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { memo, useEffect, useState } from 'react';

import Data from '@/components/Render';
import { fetchDocuments, formatData, subscribeToDocumentUpdates } from '@/services/documents';
import { ResponseData, Settings } from '@/type';

const Render = memo(() => {
  const [data, setData] = useState<ResponseData>();
  const [payload, setPayload] = useState<any>();
  const [fetching, setFetching] = useState<boolean>(false);
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

  const fetchData = async (setting: Settings) => {
    // clear data
    setFetching(true);
    setData(undefined);
    const data = await fetchDocuments(payload, setting); // Incorporate settings into fetch
    setData(data);
    setFetching(false);
    lobeChat.setPluginMessage(formatData(data));
  };

  // Establish EventSource connection
  useEffect(() => {
    console.log('subscribing to document updates');
    const unsubscribe = subscribeToDocumentUpdates(
      (newDocument) => {
        // Check if we should ignore updates while fetching
        if (fetching) return;

        // Update the data using functional state update
        setData(prevData => {
          if (!prevData) return { articles: [newDocument] };

          const updatedArticles = [...(prevData.articles || []), newDocument];

          lobeChat.setPluginMessage(formatData({ articles: updatedArticles }));
          return { articles: updatedArticles };
        });
        console.log('New document added:', newDocument);
      },
      
      (updatedDocument) => {
        if (fetching) return;

        setData(prevData => {
          if (!prevData) return { articles: [updatedDocument] };
          // Filter out the old document and add the updated one
          const updatedArticles = [
            ...(prevData.articles ? prevData.articles.filter((doc) => doc.path !== updatedDocument.path) : []),
            updatedDocument,
          ];
          lobeChat.setPluginMessage(formatData({ articles: updatedArticles }));
          return { articles: updatedArticles };
        });
      },

      (deletedDocument) => {
        if (fetching) return;

        // Update the data to remove the deleted document
        setData(prevData => {
          if (!prevData) return { articles: [] };

          const updatedArticles = prevData.articles ? prevData.articles.filter((doc) => doc.path !== deletedDocument.path) : [];

          lobeChat.setPluginMessage(formatData({ articles: updatedArticles }));
          return { articles: updatedArticles };
        });
      }
    );

    // Cleanup function to unsubscribe from document updates
    return unsubscribe;
}, []);


  return (
    <Data
      articles={!data ? [] : data.articles}
      settings={settings}
      updateSettings={setSettings}
      fetching={fetching}
      fetchData={fetchData}
    />
  );
});

export default Render;
