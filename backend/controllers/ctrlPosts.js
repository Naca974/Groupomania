const models = require("../models/index");
const fs = require("fs");

// Show all messages
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await models.Post.findAll({
      order: [['createdAt', 'DESC']],
      attributes: {
        include: ['id','title','UserId','description','imageUrl','likes','createdAt',
        [models.sequelize.fn('COUNT', models.sequelize.col('Comments.id')), 'commentCount']],
      },
      group: ['id'],
      include: [{
        model: models.User,
        attributes: ['username','profile'],
      }, {
        model: models.Comment,
        attributes: ['description','commentImageUrl', 'createdAt', 'likes'],
        include: [{
          model: models.User,
          attributes: ['username','profile'],
        }]
      }]
    });
    if(!posts){
      return res.status(404).json({error: "Posts Not Found"});
    }
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Show one message
exports.getOnePost = async (req, res) => {
  try {
    const post = await models.Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        include: ['id','title','UserId','description','imageUrl','likes','createdAt',
        [models.sequelize.fn('COUNT', models.sequelize.col('Comments.id')), 'commentCount']],
      },
      group: ['id'],
      include: [{
        model: models.User,
        attributes: ['username','profile'],
      }, {
        model: models.Comment,
        attributes: ['description','commentImageUrl', 'createdAt', 'likes'],
        include: [{
          model: models.User,
          attributes: ['username','profile'],
        }]
      }]
    });
    if (!post) {
      return res.status(404).send({ message: "Post introuvable!" });
    }
    return res.status(200).send(post);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Create a message
exports.createPost = async (req, res) => {
  try {
    const postObject = req.file ? 
      {
        ...JSON.parse(req.body.post),
        UserId: req.userId,
        likes: 0,
        commentCount: 0,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
      : { 
        ...req.body,
        UserId: req.userId,
        likes: 0,
        commentCount: 0,
      };
    console.log(postObject);
    models.Post.create(postObject)
    .then((num) => {
      console.log(num);
      return res.status(201).json({message: "Post Creation Successfull"});
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error})
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({error: err});
  }
};

// Update a message
exports.updatePost = async (req, res) => {
  try {
    console.log('they');
    const post = await models.Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        include: ['id','title','UserId','description','imageUrl','likes','createdAt',
        [models.sequelize.fn('COUNT', models.sequelize.col('Comments.id')), 'commentCount']],
      },
      group: ['id'],
      include: [{
        model: models.User,
        attributes: ['username','profile'],
      }, {
        model: models.Comment,
        attributes: ['description','commentImageUrl', 'createdAt', 'likes'],
        include: [{
          model: models.User,
          attributes: ['username','profile'],
        }]
      }]
    });
    if(!post) {
      return res.status(404).json({error: "Post not Found"});
    }
    console.log(post);
    console.log('now')
    if (req.file) {
      if(post.imageUrl) {
        console.log('in imageurl')

        const filename = post.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
          console.log("Image supprimée!");
        });
      }
    }
    console.log('in now')

    const postObject = req.file
      ? {
          ...JSON.parse(req.body.post),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : {
          ...req.body,
        };
    console.log(postObject);
    
    let num = await models.Post.update({...postObject, commentCount: post.commentCount},{
      where: {id: req.params.id}
    });
    if (num[0] !== 1) {
      return res.status(400).json({error: `Failed to update Post`});
    }
    return res.status(200).send({ message: "Le post a été mis à jour!" });
  } catch (err) {
    console.log(err)
    return res.sendStatus(500);
  }
};

// Delete a message
exports.deletePost = async (req, res) => {
  try {
    const post = await models.Post.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (post.imageUrl) {
      const filename = post.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) throw err;
        console.log("Image a été supprimée!");
      });
    }

    let result = await models.Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result !== 1) {
      return res.status(417).json({error: `Failed to delete Post`});
    }
    res.status(200).send({ message: "Le post a été supprimé! " });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
