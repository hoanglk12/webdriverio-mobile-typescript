import { readFileSync } from 'fs';
import { basename } from 'path';
import axios from 'axios';
import { config as dotenvConfig } from 'dotenv';
import { logger } from '../utils/logger';

dotenvConfig({ quiet: true });

const platform = process.argv[2];

if (platform !== 'android' && platform !== 'ios') {
  logger.error('Usage: tsx scripts/uploadAppToBrowserStack.ts <android|ios>');
  process.exit(1);
}

const appPath = platform === 'android' ? process.env.ANDROID_APP_PATH : process.env.IOS_APP_PATH;
const envVarToSet =
  platform === 'android' ? 'BROWSERSTACK_ANDROID_APP_ID' : 'BROWSERSTACK_IOS_APP_ID';

if (!appPath) {
  logger.error(
    `${platform === 'android' ? 'ANDROID_APP_PATH' : 'IOS_APP_PATH'} is not set in .env`
  );
  process.exit(1);
}

if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
  logger.error('BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set in .env');
  process.exit(1);
}

async function upload(): Promise<void> {
  const fileBuffer = readFileSync(appPath as string);
  const form = new FormData();
  form.append('file', new Blob([fileBuffer]), basename(appPath as string));

  const response = await axios.post<{ app_url: string }>(
    'https://api-cloud.browserstack.com/app-automate/upload',
    form,
    {
      auth: {
        username: process.env.BROWSERSTACK_USERNAME as string,
        password: process.env.BROWSERSTACK_ACCESS_KEY as string,
      },
    }
  );

  logger.info(`Uploaded ${appPath} -> ${response.data.app_url}`);
  logger.info(`Set ${envVarToSet}=${response.data.app_url} in .env`);
}

upload().catch((error) => {
  logger.error(`Upload failed: ${error.message}`);
  process.exit(1);
});
