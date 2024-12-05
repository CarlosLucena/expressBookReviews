const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const fetchUser = (username) => users.filter((user) => user.username == username)
const isValid = (username) => fetchUser(username).length > 0;

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let user = fetchUser(username)
    return user.length > 0 && user[0].password == password
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        user:username 
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const book = books[req.params.isbn]
  if (!book) { return res.status(404); }
  
  let username = req.user 
  let userReview = req.body.review
  let review = book.reviews.filter(r => r.username === username)
  if (review) {
    review.review = userReview
  } else {
    book.reviews.push({username: userReview})
  }
  return res.status(200);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
