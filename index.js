const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const Releaser = (() => {
  let packageJSON = {};

  const bumpVersion = (index, resetLower) => {
    const version = packageJSON.version.split('.').map(num => +num);
    version[index]++;
    if (resetLower) {
      for (let i = version.length - 1; i > index; i--) {
        version[i] = 0;
      }
    }
    packageJSON.version = version.join('.');
    return packageJSON.version;
  }

  const execCommand = (command) => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject({ error, stderr });
        }
        resolve(stdout);
      });
    })
  }

  const confirmSaving = (newVersion, type) => {
    rl.question(`Is new version: ${newVersion} ok? [Y/n] `, (answer) => {
      if (answer.toLowerCase() === 'y' || answer === '') {
        saveToFile()
        execCommand('npm install')
          .then((stdout) => {
            console.info(`Version ${newVersion} has been released.`);
          })
          .then(() => {
            rl.question('Do you want to commit and push? [Y/n]', (answer) => {
              if (answer.toLowerCase() === 'y' || answer === '') {
                execCommand(`git commit -am "bump to version: ${newVersion}"; git push`)
                  .then(() => {
                    console.log('Pushed.');
                  })
                  .catch(gitError => {
                    console.warn('Error while pushing:', gitError);
                  })
                  .then(() => {
                    rl.close();
                  });
              }
              else {
                rl.close();
              }
            })
          })
          .catch((error) => {
            console.warn('Error occured:', error);
          });
      }
      else {
        console.log('Quitting, Bye.')
        rl.close();
      }
    });
  }

  const saveToFile = () => {
    fs.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2));
  }

  const releasePatch = () => {
    confirmSaving(bumpVersion(2), 'patch');
  };
  const releasemMinor = (resetLower) => {
    confirmSaving(bumpVersion(1, resetLower), 'minor');
  };
  const releaseMajor = (resetLower) => {
    confirmSaving(bumpVersion(0, resetLower), 'major');
  };

  return {
    init() {
      packageJSON = JSON.parse(fs.readFileSync('./package.json').toString());
      return this;
    },
    release() {
      const args = process.argv.slice(2);
      const resetLower = !!args.find(param => param === '--reset-lower');
      switch (args[0]) {
        case 'patch':
          releasePatch();
          break;
        case 'minor':
          releasemMinor(resetLower);
          break;
        case 'major':
          releaseMajor(resetLower);
          break;
      
        default:
          console.warn('Only [ patch, minor, major ] releases are available.');
          break;
      }
    }
  }
})();

Releaser.init().release();