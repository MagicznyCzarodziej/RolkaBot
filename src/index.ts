import Rolka from './Rolka';
import * as path from 'path';
import config from './config';

const rolka = new Rolka(config);

rolka.start();