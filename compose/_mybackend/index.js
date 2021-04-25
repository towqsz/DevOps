const express = require("express");
const app = express();
app.get("/hello", (req, res) => {
    res.send("Hello phones!");
});

const PORT = 4000;
app.listen(PORT, () =>{
    console.log("Api listening on poort 4000.");
});