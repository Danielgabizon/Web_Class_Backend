import initApp from "./server";
const port = process.env.PORT;

initApp()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize app:", error);
  });
