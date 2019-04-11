const childProcess = require('child_process');
const oldSpawn = childProcess.spawn;

function mySpawn() {
  console.log('spawn called');
  console.log(arguments);
  const result = oldSpawn.apply(this, arguments);
  return result;
}
childProcess.spawn = mySpawn;

module.exports = childProcess;
  
  
