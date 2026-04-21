import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

export function buildOpenApiSpec() {
  const options: swaggerJSDoc.Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "AI Interview Screener API",
        version: "1.0.0"
      }
    },
    apis: [
      path.join(process.cwd(), "src", "routes", "*.ts")
    ]
  };

  return swaggerJSDoc(options);
}

