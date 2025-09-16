// Override default ESM resolver to map paths
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { join } from 'path';
import * as fs from 'fs';
const require = createRequire(fileURLToPath(import.meta.url));
const __dirname = fileURLToPath(new URL('.', import.meta.url));
import { createMatchPath, loadConfig, matchFromAbsolutePaths } from 'tsconfig-paths';
const configLoaderResult = loadConfig();
const matchPath = createMatchPath(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths, configLoaderResult.mainFields, true);
/** @type {import('ts-node/dist-raw/node-internal-modules-esm-resolve')} */
const esmResolver = require(join(__dirname, '..', 'node_modules', 'ts-node', 'dist-raw', 'node-internal-modules-esm-resolve.js'));
const originalCreateResolve = esmResolver.createResolve;
esmResolver.createResolve = opts => {
    const resolve = originalCreateResolve(opts);
    const originalDefaultResolve = resolve.defaultResolve;
    resolve.defaultResolve = (specifier, context, defaultResolveUnused) => {
        const found = matchPath(specifier);
        if (found) {
            // NOTE: unfortunately matchPath doesn't give us the absolute path
            // therefore we have to cheat here a bit
            if (fs.existsSync(found + '.ts')) {
                specifier = new URL(`file:///${found}.ts`).href;
            }
            else if (fs.existsSync(join(found, 'index.ts'))) {
                specifier = new URL(`file:///${join(found, 'index.ts')}`).href;
            }
        }
        const result = originalDefaultResolve(specifier, context, defaultResolveUnused);
        return result;
    };
    return resolve;
};
//
// Adopted from ts-node/esm
/** @type {import('ts-node/dist/esm')} */
const esm = require(join(__dirname, '..', 'node_modules', 'ts-node', 'dist', 'esm.js'));
export const { resolve, load, getFormat, transformSource } = esm.registerAndCreateEsmHooks();
