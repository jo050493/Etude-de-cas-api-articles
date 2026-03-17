const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const User = require("../api/users/users.model");

describe("tester API articles", () => {
  let token;
  const USER_ID = "507f1f77bcf86cd799439011";

  // un utilisateur admin pour les tests
  const MOCK_USER = {
    _id: USER_ID,
    name: "admin",
    email: "admin@test.com",
    role: "admin",
  };

  // données de test pour les articles
  const MOCK_ARTICLES = [
    {
      _id: "507f1f77bcf86cd799439022",
      title: "Mon article",
      content: "Le contenu de l'article",
      status: "draft",
      user: USER_ID,
    },
  ];

  const MOCK_ARTICLE_CREATED = {
    title: "Nouvel article",
    content: "Contenu du nouvel article",
    status: "published",
  };

  beforeEach(() => {
    // on génère un token valide
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);

    // mock de l'utilisateur pour le middleware auth
    mockingoose(User).toReturn(MOCK_USER, "findOne");

    // mocks pour les articles
    mockingoose(Article).toReturn(MOCK_ARTICLES, "find");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "findOneAndUpdate");
    mockingoose(Article).toReturn({ deletedCount: 1 }, "deleteOne");
  });

  // test création d'un article
  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
  });

  // test mise à jour d'un article
  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put("/api/articles/507f1f77bcf86cd799439022")
      .send({ title: "Titre modifié" })
      .set("x-access-token", token);
    expect(res.status).toBe(200);
  });

  // test suppression d'un article
  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete("/api/articles/507f1f77bcf86cd799439022")
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  // test sans token - doit retourner 401
  test("[Articles] Create without token", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED);
    expect(res.status).toBe(401);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
});
