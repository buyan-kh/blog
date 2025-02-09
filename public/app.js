document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("postForm");
  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const postsDiv = document.getElementById("posts");

  const fetchPosts = async () => {
    const response = await fetch("/posts");
    const posts = await response.json();
    postsDiv.innerHTML = "";
    posts.forEach((post, index) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
                <a href="/post/${index}">${post.title}</a>
                <button onclick="deletePost(${index})">Delete</button>
            `;
      postsDiv.appendChild(postElement);
    });
  };

  const addPost = async (title, content) => {
    await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    fetchPosts();
  };

  const deletePost = async (index) => {
    await fetch(`/posts/${index}`, {
      method: "DELETE",
    });
    fetchPosts();
  };

  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addPost(postTitle.value, postContent.value);
    postTitle.value = "";
    postContent.value = "";
  });

  fetchPosts();
});
