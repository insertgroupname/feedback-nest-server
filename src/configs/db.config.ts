export const dbConfig = () => ({
  connectionString: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mskkl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
});
