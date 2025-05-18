export class CORS {
  constructor(allowedOrigins) {
    this.allowedOrigins = allowedOrigins;
  }

  corsOptions = {
    origin: (origin, callback) => {
      if (!origin || this.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
}
