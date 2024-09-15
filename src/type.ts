export interface FolderItem {
  name: string;
}

export interface ResponseData {
  folders: FolderItem[];
}

export interface RequestData {
}

export interface Settings {
  NOVEL_ROOT_FOLDER?: string;
}