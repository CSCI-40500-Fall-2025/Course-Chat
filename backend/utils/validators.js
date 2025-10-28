export const isPasswordComplex = (password) => {
  // minimum 8 letters, at least 1 uppercase, 1 lowercase, one number, and one special char
  const complexityRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  return complexityRegex.test(password);
};

export const isUsernameComplex = (username) => {
  // username must be between 3 and 16 characters, can contain letters, numbers, and underscores, must start with a letter
  const complexityRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  return complexityRegex.test(username);
};
