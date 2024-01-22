import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from "pg";

const app = express();
const port = 3000;

let posts = [
    {title: "demo title", content: "demo content"}
];

// get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// content-type should be set to 'text/css'
app.use('/public/styles', express.static(__dirname + '/public/styles', { 
    setHeaders: (res) => {
       res.type('text/css');
    }
 }));

//connect AWS postgres database
const db = new pg.Client({
    user: "postgres",
    host: "my-first-db-instance.cn4ussua40q5.ap-southeast-2.rds.amazonaws.com",
    database: "blog",
    password: "Xu19940521",
    port: 5432,
});
db.connect();


app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM posts");
        posts = result.rows;
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'AWS Server Error' });
    }
    res.render("home.ejs", {
        listPost: posts,
    });
});

app.get("/content/:id", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM posts");
        posts = result.rows;
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'AWS Server Error' });
    }
    const selectId = req.params.id; // selectId is string type
    const selectPost = posts.find(({id}) => id === parseInt(selectId));
    // console.log(posts);
    // console.log(typeof(selectId));
    // console.log(selectPost);
    res.render("content.ejs", {
        selectPost: selectPost,
        selectId: selectId,
    });
});

app.post("/create", async (req, res) => {
    const newPost = {
        title: req.body.title,
        content: req.body.content
    };

    try {
        await db.query("INSERT INTO posts (title, content) VALUES ($1, $2)", [newPost.title, newPost.content]);
    } catch (error) {
        console.error('Error inserting query', error);
    }
    res.redirect("/");
});

app.post("/edit/:id", async (req, res) => { 

    const selectId = req.params.id;
    const updatedContent = req.body.updatedContent;
    try {
        await db.query("UPDATE posts SET content = $1 WHERE id = $2;", [updatedContent, parseInt(selectId)]);
      } catch (error) {
        console.error('Error updating query', error);
      }
    res.redirect(`/content/${selectId}`);
});

app.post("/delete/:id", async (req, res) => {
    const selectId = req.params.id;
    try {
        await db.query("DELETE FROM posts WHERE id = $1;", [parseInt(selectId)]);
      } catch (error) {
        console.error('Error deleting query', error);
      }

    res.redirect("/");
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});




