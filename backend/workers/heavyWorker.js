function sum() {
  return new Promise((resolve) => {
    let total = 0
    for (let i = 0; i < 5e9; i++) {
      total += i; // still blocking main thread!
    }
    resolve(total);
  });
}

async function hello() {
  const sumi = await sum();
  console.log("hello")
}

hello()

console.log("Subscribing to ByteMonk...");
console.log("Subscribing to ByteMonk...");
console.log("Subscribing to ByteMonk...");
 // ye wait karega
