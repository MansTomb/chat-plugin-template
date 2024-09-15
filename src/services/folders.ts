import { RequestData } from '@/type';
import { createHeadersWithPluginSettings } from '@lobehub/chat-plugin-sdk';
import { lobeChat } from '@lobehub/chat-plugin-sdk/client';

export const fetchFolders = async (params: any) => {
  var headers = createHeadersWithPluginSettings(await lobeChat.getPluginSettings());
  const res = await fetch('/api/getFolders', {
    body: JSON.stringify(params),
    method: 'POST',
    headers: headers,
  });

  return res.json();
};
