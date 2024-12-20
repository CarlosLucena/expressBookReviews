const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username.trim();
  const password = req.body.password;
  if (username.length == 0) {
    return res.status(404).json({ message: "Invalid user name!" });
  }
  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists!"});
  }
  if (password.length == 0) {
    return res.status(404).json({ message: "Invalid password!"});
  }

  users.push({ "username": username, "password": password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const books = await fetchBooks();
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

function fetchBooks() {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },500)})
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = await fetchBookByIsbn(req.params.isbn);
        if (book) {
          return res.status(200).json(book);
        }
        return res.status(404);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch book!' });
    }
 });

function fetchBookByIsbn(isbn) {
    return new Promise((resolve,reject) => {
    setTimeout(() => {
      const book = books[isbn]
      resolve(book)
    },500)})
}

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
      const books = await fetchBooksByAuthor(req.params.author);
      if (books) {
        return res.status(200).json(books);
      }
      return res.status(404);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch books!' });
  }
});
function fetchBooksByAuthor(author) {
  return new Promise((resolve,reject) => {
  setTimeout(() => {
    const booksFilterByAuthor = Object.fromEntries(Object.entries(books).filter(book => book[1]["author"] === author))
    resolve(booksFilterByAuthor)
  },500)})
}

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
      const books = await fetchBooksByTitle(req.params.title);
      if (books) {
        return res.status(200).json(books);
      }
      return res.status(404);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch books!' });
  }
});

function fetchBooksByTitle(title) {
  return new Promise((resolve,reject) => {
  setTimeout(() => {
    const booksByTitle = Object.fromEntries(Object.entries(books).filter(book => book[1]["title"] === title))
    resolve(booksByTitle)
  },500)})
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn]
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404);
 });

module.exports.general = public_users;
