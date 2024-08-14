const { pluginTester } = require('babel-plugin-tester');
const plugin = require('babel-plugin-macros');

pluginTester({
  plugin,
  snapshot: true,
  tests: [
    {
      code: `
        import { whenDev } from "../src/macro";
       
        whenDev(() => console.log('Hello World'));
      `
    }
  ],
})
