export function generateCode(length = 4): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
} 