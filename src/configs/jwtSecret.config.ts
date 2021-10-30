export const jwtConfig = () => {
  console.log(process.env.JWT_SECRET);
  return { jwtSecret: process.env.JWT_SECRET };
};
