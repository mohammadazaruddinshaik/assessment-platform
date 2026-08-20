const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");
const prisma = require("./lib/prisma");


const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Assessment Platform API is running"
    });
});

// const testDatabase = async () => {
//     for (let i = 1; i <= 30; i++) {
//         const start = performance.now();

//         await prisma.$queryRaw`SELECT 1`;

//         const time = performance.now() - start;

//         console.log(`DB SELECT 1 #${i}: ${time.toFixed(2)} ms`);
//     }
// };

// testDatabase();

app.use(errorMiddleware);

module.exports = app;