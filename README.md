# release-script
Simple script to bump up version in `package.json`

## Script info

Script is build for node v8.8.1 Not tested on other versions

## How to use in your project?

Currently as it now a npm package you can copy content of `index.js` to your project and run it as described below.
Optionally you can add this file to `.gitignore`

## Run

`package.json` contains run scripts.

But simple example is:
```
  $ node index.js patch
```

## Run Params

### --reset-lower
`--reset-lower` will reset lower version number.

For instance, let's say your current version is `0.1.12`.
If you run
```
  $ node index.js minor --reset-lower
```
where `index.js` is script that bumps versions

your new version will be `0.2.0`

### License

Copyright © 2017, [Szymon Półtorak](https://github.com/poltorak).
Released under the [MIT License](LICENSE).
