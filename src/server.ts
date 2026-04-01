import app from "./app";
import { envVars } from "./app/config/env";

// Start the server
const port = envVars.PORT;
const bootstrap = () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

bootstrap();
