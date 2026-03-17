const Article = require("./articles.schema");

class ArticleService {
  // récupérer tous les articles
  getAll() {
    return Article.find().populate("user", "-password");
  }

  // récupérer un article par son id
  get(id) {
    return Article.findById(id).populate("user", "-password");
  }

  // créer un article
  create(data) {
    const article = new Article(data);
    return article.save();
  }

  // mettre à jour un article
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  // supprimer un article
  delete(id) {
    return Article.deleteOne({ _id: id });
  }

  // récupérer les articles d'un utilisateur
  getByUser(userId) {
    return Article.find({ user: userId }).populate({
      path: "user",
      select: "-password",
    });
  }
}

module.exports = new ArticleService();
