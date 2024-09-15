const url = 'http://localhost:3401';

export const API =  {

  documents: async (body: string) => await fetch(url + '/api/documents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body
  }),
}