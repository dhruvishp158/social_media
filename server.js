const express = require("express");
const connectDB = require("./config/db");
//connect database
connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running..");
});

//Define routes from api folder
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
