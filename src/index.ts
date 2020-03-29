import Rolka from './Rolka';
import * as path from 'path';
import * as YAML from 'yamljs'

const config = YAML.load(path.resolve(__dirname, 'config.yml'));

const rolka = new Rolka(config);

rolka.start();