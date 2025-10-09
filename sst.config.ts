// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "www",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("MyVpc");
    const cluster = new sst.aws.Cluster("MyCluster", { vpc });

    new sst.aws.Service("MyService", {
      cluster,
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      image: {
        context: ".",
        dockerfile: "./Dockerfile",
        target: "runner",
      },
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
        AUTH_SECRET: process.env.AUTH_SECRET!,
        AUTH_COGNITO_CLIENT_ID: process.env.AUTH_COGNITO_CLIENT_ID!,
        AUTH_COGNITO_CLIENT_SECRET: process.env.AUTH_COGNITO_CLIENT_SECRET!,
        AUTH_COGNITO_ISSUER: process.env.AUTH_COGNITO_ISSUER!,
        AUTH_COGNITO_DOMAIN: process.env.AUTH_COGNITO_DOMAIN!,
        NEXT_PUBLIC_AUTH_COGNITO_DOMAIN:
          process.env.NEXT_PUBLIC_AUTH_COGNITO_DOMAIN!,
        NEXT_PUBLIC_AUTH_COGNITO_CLIENT_ID:
          process.env.NEXT_PUBLIC_AUTH_COGNITO_CLIENT_ID!,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL!,
        AUTH_TRUST_HOST: "true",
      },
    });
  },
});
