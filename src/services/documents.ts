import { Settings } from '@/type';

export const fetchDocuments = async (payload: any, settings: Settings) => {

  const res = await fetch('/api/getDocuments', {
    body: JSON.stringify({payload, settings}),
    method: 'POST',
  });

  return res.json();
};
