export function GenerateOTP(otpSize: number) {
  const digits = '0123456789' as const;
  let OTP = '';
  let n = 0;
  while (n == 0) {
    n = parseInt(digits[Math.floor(Math.random() * 10)]);
  }
  OTP += n;

  for (let i = 1; i < otpSize; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return parseFloat(OTP);
}
