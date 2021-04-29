import { runCLI } from '@jest/core';
import path from 'path';
import packageJson from '../../package.json';

import { CLIOptions } from 'aurelia-cli';

export default (cb) => {
  let options = packageJson.jest;

  if (CLIOptions.hasFlag('watch')) {
    Object.assign(options, { watchAll: true});
  }

  //process.env.BABEL_TARGET = '/home/vagrant/node-v15.11.0-linux-x64/bin/node';
  process.env.BABEL_TARGET = 'node';

  runCLI(options, [path.resolve(__dirname, '../../')]).then(({ results }) => {
    if (results.numFailedTests || results.numFailedTestSuites) {
      cb('Tests Failed');
    } else {
      cb();
    }
  });
};