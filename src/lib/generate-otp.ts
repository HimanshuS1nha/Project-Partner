import { generate } from "otp-generator";

export const generateOtp = () => {
  const otp = generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
  });

  return parseInt(otp);
};
