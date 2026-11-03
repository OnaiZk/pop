import fs from 'node:fs';
import { Config } from '@remotion/cli/config';

const SYSTEM_BROWSERS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

for (const candidate of SYSTEM_BROWSERS) {
  if (fs.existsSync(candidate)) {
    Config.setBrowserExecutable(candidate);
    break;
  }
}

Config.setOverwriteOutput(true);
