const jwt = require("jsonwebtoken");
const models = require("../models/index");

require("dotenv").config({ path: process.cwd() + "/.env" });

module.exports = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization.split(" ")[1]; /* Finding the token */
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN
    ); /* checking if matching with the key*/
    const userId = decodedToken.userId;
    req.userId = userId;

    if(req.roles) {
      return next();
    } else {
      if(req.baseUrl === "/user") {
        if(req.method === 'PUT' || req.method === 'DELETE') {
            let user = await models.User.findByPk(userId);
            console.log("The user Id: ", user.id);
            if (user.id === userId) {
                return next();
            } else {
                throw new Error('User Authentification failed');
            }
        } else {
            if(!req.userId) {
                throw new Error('User Authentification failed');
            }
            return next();
        }
      }
      if(req.baseUrl === "/post") {
          console.log(req.originalUrl);
          console.log("The request method: ",req.method);
          if(req.method === 'PUT' || req.method === 'DELETE') {
              let post = await models.Post.findOne({where: {UserId: userId}});
              console.log("The post UserId: ", post.UserId);
              if (post.UserId !== userId ) {
                  throw new Error('User Authentification failed');
              } else {
                  return next();
              }
          } else {
              if(!req.userId) {
                  throw new Error('User Authentification failed');
              }
              return next();
          }
      }
      if(req.baseUrl === "/comment") {
          if(req.method === 'PUT' || req.method === 'DELETE') {
              let comment = await models.Comment.findOne({where: {UserId: userId}});
              console.log("The comment UserId: ", comment.UserId);
              if (comment.UserId !== userId) {
                  throw new Error('User Authentification failed');
              } else {
                  return next();
              }
          } else {
              if(!req.userId) {
                  throw new Error('User Authentification failed');
              }
              return next();
          }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: new Error() | "Requête non authentifiée !" });
  }
};
