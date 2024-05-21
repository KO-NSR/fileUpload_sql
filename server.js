const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const fileUpload = require("express-fileupload");
const PORT = 5000;

app.use(fileUpload());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
    res.render("home");
});

app.post("/", (req, res) => {
    if(!req.files) {
        return res.status(400).send("Nothind has been uploaded.")
    }
    const imageFile = req.files.imageFile;
    const uploadPath = __dirname + "/upload/" + imageFile.name;

    //サーバーに画像ファイルを置く場所の指定
    imageFile.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send("Image upload successfully.");
    })

})

app.listen(PORT, () => console.log("Server is running"));