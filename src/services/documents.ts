import { ResponseData, Settings } from '@/type';

export const fetchDocuments = async (payload: any, settings: Settings) => {

  const res = await fetch('/api/getDocuments', {
    body: JSON.stringify({payload, settings}),
    method: 'POST',
  });

  return res.json();
};


/* instead of returning json, we can format the data
  firstly sort by path
  remove file extension from title
  then start pushing to the string array with title and content
  then return the concatenated string
*/
export const formatData = (data: ResponseData) => {
  if (!data || !data.articles) return data
  if (data.articles.some(article => !article.path.endsWith('.md'))) return data

  const sortedData = data.articles.sort((a, b) => a.path.localeCompare(b.path));
  let formattedData = '';
  sortedData.forEach(article => {
    const title = article.title.replace(/\.[^/.]+$/, '');
    formattedData += `Document: ${title}\n${article.content}\n\n`;
  });
  formattedData += 'End of Document';
  return formattedData;
}