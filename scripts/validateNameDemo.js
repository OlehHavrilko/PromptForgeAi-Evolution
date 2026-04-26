// Demo script for validateProjectName
// Usage: node scripts/validateNameDemo.js <name>
const name = process.argv[2] || '';
const re = /^(?!.*---)[a-z0-9._-]{1,100}$/;
function isValidProjectName(n) {
  return re.test(n);
}
console.log(`${name} => ${isValidProjectName(name)}`);
