import { PluginErrorType, createErrorResponse } from '@lobehub/chat-plugin-sdk';
import { Settings } from '@/type';
import { API } from '@/API';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return createErrorResponse(PluginErrorType.MethodNotAllowed);

  const payload = await req.json();
  const settings = payload.settings as Settings;

  if (!settings) {
    return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
      message: 'Plugin settings not found.',
    });
  }

  if (!settings.DOCUMENTS_ROOT_FOLDER) {
    return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
      message: 'Root folder not set.',
    });
  }

  try {
    const response = await API.documents(JSON.stringify(settings));

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    return createErrorResponse(PluginErrorType.BadRequest, {
      message: 'Fail at backend: ' + error,
    });
  }
};
