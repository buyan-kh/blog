const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const postsFilePath = path.join(__dirname, "posts.json");

app.use(express.json());
app.use(express.static("public"));

app.get("/posts", (req, res) => {
  fs.readFile(postsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading posts");
    }
    try {
      const posts = JSON.parse(data);
      res.json(posts);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).send("Error reading posts");
    }
  });
});

app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  fs.readFile(postsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading posts");
    }
    const posts = JSON.parse(data);
    posts.push({ title, content });
    fs.writeFile(postsFilePath, JSON.stringify(posts), (err) => {
      if (err) {
        return res.status(500).send("Error saving post");
      }
      res.status(201).send("Post added");
    });
  });
});

app.get("/post/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  fs.readFile(postsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading posts");
    }
    const posts = JSON.parse(data);
    if (index >= 0 && index < posts.length) {
      const post = posts[index];
      res.send(`
        <html>
          <head>
            <title>${post.title}</title>
          </head>
          <body>
            <h1>${post.title}</h1>
            <p>${post.content}</p>
            <a href="/">Back to home</a>
          </body>
        </html>
      `);
    } else {
      res.status(404).send("Post not found");
    }
  });
});

app.delete("/posts/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  fs.readFile(postsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading posts");
    }
    const posts = JSON.parse(data);
    posts.splice(index, 1);
    fs.writeFile(postsFilePath, JSON.stringify(posts), (err) => {
      if (err) {
        return res.status(500).send("Error deleting post");
      }
      res.status(200).send("Post deleted");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
