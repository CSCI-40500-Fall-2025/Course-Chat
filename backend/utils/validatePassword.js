export const isPasswordComplex = (password) => {
  // minimum 8 letters, at least 1 uppercase, 1 lowercase, one number, and one special char
  const complexityRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  return complexityRegex.test(password);
};
