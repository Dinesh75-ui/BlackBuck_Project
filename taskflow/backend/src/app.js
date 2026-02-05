const allowedOrigins = [
  "http://localhost:5173",
  "https://blackbuckassessment.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
