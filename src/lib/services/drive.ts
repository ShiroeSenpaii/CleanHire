import fs from 'fs/promises';
import path from 'path';
import { google } from 'googleapis';
import { env } from '@/lib/env';

function hasDriveConfig() {
  return !!(env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
}

function getDriveClient() {
  const jwt = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive']
  });

  return google.drive({ version: 'v3', auth: jwt });
}

export async function createHireFolder(hireName: string) {
  if (!hasDriveConfig()) {
    const safe = hireName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const folder = path.join('/tmp', 'cleanops', safe);
    await fs.mkdir(folder, { recursive: true });
    return { id: folder, webViewLink: `file://${folder}` };
  }

  const drive = getDriveClient();
  const res = await drive.files.create({
    requestBody: {
      name: `Hire - ${hireName}`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: env.GOOGLE_DRIVE_PARENT_FOLDER_ID ? [env.GOOGLE_DRIVE_PARENT_FOLDER_ID] : undefined
    },
    fields: 'id,webViewLink'
  });

  return { id: res.data.id!, webViewLink: res.data.webViewLink || '' };
}

export async function uploadFileToHireFolder(folderId: string, fileName: string, mimeType: string, buffer: Buffer) {
  if (!hasDriveConfig()) {
    await fs.mkdir(folderId, { recursive: true });
    const target = path.join(folderId, fileName);
    await fs.writeFile(target, buffer);
    return { id: target, webViewLink: `file://${target}` };
  }

  const drive = getDriveClient();
  const res = await drive.files.create({
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType, body: Buffer.from(buffer) as any },
    fields: 'id,webViewLink'
  });
  return { id: res.data.id!, webViewLink: res.data.webViewLink || '' };
}
