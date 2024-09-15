import { PluginErrorType, createErrorResponse, getPluginSettingsFromRequest } from '@lobehub/chat-plugin-sdk';
import { ResponseData, Settings } from '@/type';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return createErrorResponse(PluginErrorType.MethodNotAllowed);

  const settings = getPluginSettingsFromRequest<Settings>(req);

  if (!settings) {
    return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
      message: 'Plugin settings not found.',
    });
  }

  if (!settings.NOVEL_ROOT_FOLDER) {
    return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
      message: 'Root folder not set.',
    });
  }

  try {
    const response = await fetch('http://localhost:3401/api/folders', {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const folders = await response.json() as ResponseData;
    return new Response(JSON.stringify(folders));
  } catch (error) {
    return createErrorResponse(PluginErrorType.BadRequest, {
      message: 'Fail at backend: ' + error,
    });
  }
};
