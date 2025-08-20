

const {writeFileSync, mkdirSync} = require('fs')

require('dotenv').config();

const targetPath = './src/enrironments/environment.ts';
const targetPathDev = './src/enrironments/environment.development.ts';

const mapboxKey = process.env['MAPBOX_KEY'];

if(!mapboxKey) {
    throw new Error ('MAPBOX_KEY is not set')
}

const envFileContent = `
export const environment = {
    mapboxKey: "${mapboxKey}"
   
};

`
;

mkdirSync('./src/enrironments', { recursive: true });

writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);