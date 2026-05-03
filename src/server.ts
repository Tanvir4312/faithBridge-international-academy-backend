import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seed";




// Start the server
const port = envVars.PORT;
const bootstrap = async () => {

  await seedSuperAdmin()
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

bootstrap();
