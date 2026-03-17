const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {
  // créer un article - l'utilisateur doit être connecté
  async create(req, res, next) {
    try {
      const data = {
        ...req.body,
        user: req.user.userId, // on utilise l'id de l'utilisateur connecté
      };
      const article = await articlesService.create(data);
      // on envoie en temps réel
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  // mettre à jour un article - seulement si admin
  async update(req, res, next) {
    try {
      // on vérifie que l'utilisateur est admin
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Seul un admin peut modifier un article");
      }
      const id = req.params.id;
      const data = req.body;
      const article = await articlesService.update(id, data);
      if (!article) {
        throw new NotFoundError("Article non trouvé");
      }
      // temps réel
      req.io.emit("article:update", article);
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  // supprimer un article - seulement si admin
  async delete(req, res, next) {
    try {
      // on vérifie que l'utilisateur est admin
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Seul un admin peut supprimer un article");
      }
      const id = req.params.id;
      await articlesService.delete(id);
      // temps réel
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
