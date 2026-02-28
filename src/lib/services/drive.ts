import { google } from 'googleapis';
import { env } from '@/lib/env';

function getDriveClient() {
  if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new Error('Google Drive credentials missing');
  }

  const jwt = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive']
  });

  return google.drive({ version: 'v3', auth: jwt });
}

export async function createHireFolder(hireName: string) {
  const drive = getDriveClient();
  const res = await drive.files.create({
    requestBody: {
      name: `Hire - ${hireName}`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: env.GOOGLE_DRIVE_PARENT_FOLDER_ID ? [env.GOOGLE_DRIVE_PARENT_FOLDER_ID] : undefined
    },
    fields: 'id, webViewLink'
  });
  return { id: res.data.id!, webViewLink: res.data.webViewLink };
}

export async function uploadFileToHireFolder(folderId: string, fileName: string, mimeType: string, buffer: Buffer) {
  const drive = getDriveClient();
  const res = await drive.files.create({
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType, body: Buffer.from(buffer) as any },
    fields: 'id, webViewLink'
  });
  return { id: res.data.id!, webViewLink: res.data.webViewLink! };
}
