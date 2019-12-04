const express = require('express');

const postsRouter = require('../posts/post-router.js');

const server = express()

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`
  <h2>Blog Post API</h2>
  <p>Welcome to the Blog API</p>
  `)
})

server.use('/api/posts', postsRouter);

module.exports = server;