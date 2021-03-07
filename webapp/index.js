const express = require("express");

const app = express();

app.get('/hello', (eq, res)=>{
    res.send("Hello World from phone server");
});

const PORT = 9090;
app.listen(PORT, ()=> {
    console.log(`Api listetning on port ${PORT}`);
});