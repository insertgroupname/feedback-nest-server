export const jwtSecretConfig = () => {
  return { jwtSecret: process.env.JWT_SECRET };
};
