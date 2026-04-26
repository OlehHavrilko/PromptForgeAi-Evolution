export function isValidProjectName(name: string): boolean {
  // Правила:
  // - только строчные латинские буквы, цифры, '.', '_' и '-'
  // - длина 1..100
  // - не содержит последовательность '---'
  const re = /^(?!.*---)[a-z0-9._-]{1,100}$/;
  return re.test(name);
}

export default isValidProjectName;
