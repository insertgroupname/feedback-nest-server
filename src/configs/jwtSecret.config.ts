export const jwtSecretConfig = () => {
  console.log(process.env.JWT_SECRET);
  return { jwtSecret: process.env.JWT_SECRET };
};
