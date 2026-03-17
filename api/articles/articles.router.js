const express = require("express");
const articlesController = require("./articles.controller");
const router = express.Router();

// toutes ces routes nécessitent une authentification (le middleware est dans server.js)
router.post("/", articlesController.create);
router.put("/:id", articlesController.update);
router.delete("/:id", articlesController.delete);

module.exports = router;
