import express from "express";
const app = express();

app.get('/books', (req, res) => {
    res.send("books page.")
})
