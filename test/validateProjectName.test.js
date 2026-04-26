// Simple test runner (no test framework) for project name validation
const cases = [
  ['my-project', true],
  ['project.name_01', true],
  ['bad---name', false],
  ['UpperCase', false],
  ['a'.repeat(101), false],
  ['valid_name-123', true],
  ['with space', false],
  ['empty', true],
];

const re = /^(?!.*---)[a-z0-9._-]{1,100}$/;
function isValid(n) { return re.test(n); }

let failed = 0;
for (const [name, expected] of cases) {
  const got = isValid(name);
  const ok = got === expected;
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'}  '${name}' expected=${expected} got=${got}`);
}
if (failed) {
  console.error(`${failed} tests failed`);
  process.exit(1);
} else {
  console.log('All tests passed');
  process.exit(0);
}
