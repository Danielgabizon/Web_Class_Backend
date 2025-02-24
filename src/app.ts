import initApp from "./server";
const port = process.env.PORT;
(async () => {
  try {
    const app = await initApp();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
})();
