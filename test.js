const { Worker } = require('worker_threads');

function runWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js');
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

async function main() {
  console.log("Starting worker...");
  const result = await runWorker();
  console.log("Worker result:", result);
}

main();
console.log("Subscribing to ByteMonk...");