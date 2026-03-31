const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const expenseRoutes = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
    res.send("API is running");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.log("Database connection error:", error.message);
    });