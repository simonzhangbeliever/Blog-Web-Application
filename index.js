import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

app.get("/", (req, res) => {
    res.render("home.ejs", {
        listPosts: posts,
    });
});

app.get("/content/:id", (req, res) => {

    const index = req.params.id;
    res.render("content.ejs", {
        selectPost: posts[index],
        selectIndex: index,
    });
});

app.post("/create", (req, res) => {
    const newPost = {
        title: req.body.title,
        content: req.body.content
    };

    posts.push(newPost);
    res.redirect("/");
});

app.post("/edit/:id", (req, res) => {

    const index = req.params.id;
    const content = req.body.updatedContent;
    posts[index].content = content;
    res.redirect(`/content/${index}`);

});

app.post("/delete/:id", (req, res) => {
    const index = req.params.id;
    posts.splice(index, 1);
    res.redirect("/");
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});




