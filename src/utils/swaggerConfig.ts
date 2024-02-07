const swaggerConfig = {
  openapi: {
    info: {
      title: 'Munch Assessment API',
      description: 'Just a simple API for Munch Assessment',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://localhost:5000',
      },
    ],
  },
  hideUntagged: true,
  exposeRoute: true,
};

export default swaggerConfig;
