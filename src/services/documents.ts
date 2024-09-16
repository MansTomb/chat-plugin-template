import { ResponseData, Settings } from '@/type';
import { API } from '@/API';

export const fetchDocuments = async (payload: any, settings: Settings) => {
  const res = await fetch('/api/getDocuments', {
    body: JSON.stringify({ payload, settings }),
    method: 'POST',
  });

  return res.json();
};

export const formatData = (data: ResponseData|undefined) => {
  if (!data || !data.articles) return data;
  if (data.articles.some((article) => !article.path.endsWith('.md'))) return data;

  const sortedData = data.articles.sort((a, b) => a.path.localeCompare(b.path));
  let formattedData = '';
  sortedData.forEach((article) => {
    const title = article.title.replace(/\.[^/.]+$/, '');
    formattedData += `Document: ${title}\n${article.content}\n\n`;
  });
  formattedData += 'End of Document';
  return formattedData;
};

export const subscribeToDocumentUpdates = (
  onDocumentAdded: (newDocument: any) => void,
  onDocumentUpdated: (updatedDocument: any) => void,
  onDocumentDeleted: (deletedDocument: any) => void
) => {
  const eventSource = API.documentEvents();

  eventSource.addEventListener('document-added', (event) => {
    const newDocument = JSON.parse(event.data);
    onDocumentAdded(newDocument);
  });

  eventSource.addEventListener('document-modified', (event) => {
    const updatedDocument = JSON.parse(event.data);
    onDocumentUpdated(updatedDocument);
  });

  eventSource.addEventListener('document-deleted', (event) => {
    const deletedDocument = JSON.parse(event.data);
    onDocumentDeleted(deletedDocument);
  });

  return () => {
    console.log('unsubscribing from document updates');
    eventSource.close();
  };
};
