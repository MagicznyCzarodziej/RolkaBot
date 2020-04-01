import * as dotenv from 'dotenv';
import { Config } from './api';

const result = dotenv.config({ path: __dirname + '/../.env' });

if(result.error) {
  console.log('.env not found. Using provided ENV variables');
}

const config: Config = {
  TOKEN: process.env.TOKEN,
  PREFIX: '$',
  PREFIX_REQUIRED: false,
}

export default config;