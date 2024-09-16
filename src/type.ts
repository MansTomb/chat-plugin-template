export interface ResponseData {
  articles: Article[];
}

export interface Article {
  path: string; // Path to the article
  title: string; // Title: used as both identifier and display text
  content: string; // Markdown content of the article
}

export interface RequestData {
}

export interface Settings {
  DOCUMENTS_ROOT_FOLDER?: string;
  INCLUDE_FILTER?: string;
  EXCLUDE_FILTER?: string;
}

export interface Setting {
  key: keyof Settings;
  label: string;
  placeholder: string;
}