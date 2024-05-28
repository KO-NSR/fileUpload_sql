const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const PORT = 5000;

app.use(fileUpload());

app.use(express.static("upload"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "323242Asd",
    database: "imguploader_tutorial"
});

app.get("/", (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query("SELECT * from image", (error, result, fields) => {
            connection.release();
            if (error) {
                console.log("Data acquisition failure.", error);
                return;
            }
            res.render("home", { result });
        })
    })
});

app.post("/", (req, res) => {
    if(!req.files) {
        return res.status(400).send("Nothind has been uploaded.")
    }
    // console.log(req.files);
    const imageFile = req.files.imageFile;
    const uploadPath = __dirname + "/upload/" + imageFile.name;

    //サーバーに画像ファイルを置く場所の指定
    imageFile.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        console.log("Image upload successfully.");
        // const comment = "Image upload successfully !!"
        // res.render("home", { comment });
    })

    //MySQLに画像ファイルの名前を追加して保存する
    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query("INSERT INTO image (imageName) VALUES (?)", [imageFile.name], (error, result) => {
            connection.release();
            if (!error) {
                console.log("Insert success, ID:", result.insertId);
                res.redirect("/");
            } else {
                console.log("SQL error", error);
                return;
            }
        });
    });
});

app.listen(PORT, () => console.log("Server is running"));