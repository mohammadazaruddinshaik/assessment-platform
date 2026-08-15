const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Assessment Platform API is running"
    });
});

app.use(errorMiddleware);

module.exports = app;