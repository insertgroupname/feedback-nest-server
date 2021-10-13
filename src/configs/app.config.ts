export const appConfig = () => ({
  env: process.env.ENV || 'development',
  port: parseInt(process.env.PORT) || 3000,
});
