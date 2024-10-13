const express = require("express");
const categoryRouter = express.Router()

        const { createCategory, getAllCategories, deleteCategory, scoreBasedRanking, getScoreBasedRanking, hashInRedis, getHashInRedis } = require("../controller/category");

categoryRouter.post("/", createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.delete("/:name", deleteCategory);
categoryRouter.get("/score-based-ranking", scoreBasedRanking);
categoryRouter.get("/get-score-based-ranking", getScoreBasedRanking);
categoryRouter.get("/hash-in-redis", hashInRedis);
categoryRouter.get("/get-hash-in-redis", getHashInRedis);
module.exports = categoryRouter;
