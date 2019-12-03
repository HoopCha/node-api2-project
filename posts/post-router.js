const express = require('express');

const db = require('../data/db.js');

const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
      res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    } else {
      db.insert(req.body)
        .then(postId => {
          db.findById(postId.id)
            .then(post => res.status(201).json(post))
        })
        .catch(err => res.status(500).json({error: "There was an error while saving the post to the database"}))
    }
  })

router.post('/:id/comments', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if (post) {
        const newComment = {...req.body, post_id: req.params.id}
        if (!req.body.text) {
            res.status(400).json({errorMessage: "Please provide text for the comment."})
        } else {
            db.insertComment(newComment)
            .then(commentId => {
                db.findCommentById(commentId.id)
                .then(comment => res.status(201).json(comment))
            })
            .catch(err => res.status(500).json({error: "There was an error while saving the comment to the database"}))
        }
        } else {
        res.status(404).json({message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => res.status(500).json({message: "The post with the specified ID does not exist."}))
})

router.get('/', (req, res) => {
  db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({error: "The posts information could not be retrieved."}))
})

router.get('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => res.status(500).json({error: "The post information could not be retrieved." }))
})

router.get('/:id/comments', (req, res) => {
  db.findPostComments(req.params.id)
    .then(comments => {
      if (comments) {
        res.status(200).json(comments)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist."})
      }
    })
    .catch(err => res.status(500).json({error: "The comments information could not be retrieved." }))
})

router.delete('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        db.remove(req.params.id)
        .then(resp => res.status(200).json(post))
        .catch(err => res.status(500).json({error: "The post could not be removed"}))
      } else {
        res.status(404).json({message: "The post with the specified ID does not exist."})
      }
    })
    .catch(err => res.status(500).json({message: "The post with the specified ID does not exist."}))
})

router.put('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length) {
        if (req.body.title && req.body.contents) {
          db.update(req.params.id, req.body)
            .then(resp => {
              db.findById(req.params.id)
                .then(updatedPost => res.status(200).json(updatedPost))
                .catch(err => res.status(500).json({error: "The post information could not be modified." }))
            })
            .catch(err => res.status(500).json({error: "The post information could not be modified." }))
        } else {
          res.status(400).json({errorMessage: "Please provide title and contents for the post."})
        } 
      } else {
        res.status(404).json({message: "The post with the specified ID does not exist."})
      }
    })
    .catch(err => res.status(500).json({error: "The post information could not be modified." }))
})

module.exports = router