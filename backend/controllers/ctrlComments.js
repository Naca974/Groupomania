const models = require("../models/index");

// Show comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await models.Comment.findAll({
      include: [{
        model: models.User,
        attributes: ['username','profile'],
      }, ],
      where: { PostId: req.params.id }, 
    });
    if(!comments){
      return res.status(404).json({error: "Posts Not Found"});
    }
    res.status(200).send(comments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Create comments
exports.createComment = async (req, res) => {
  try {
    const commentObject = req.file ? 
      {
        ...JSON.parse(req.body.comment),
        UserId: req.userId,
        PostId: req.params.id,
        likes: 0,
        commentImageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
      : { 
        ...req.body,
        UserId: req.userId,
        PostId: req.params.id,
        likes: 0,
      };
    console.log(commentObject);
    models.Comment.create(commentObject)
    .then((num) => {
      console.log(num);
      res.status(201).json({message: "Comment Creation Successfull"});
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

// Delete comments
exports.deleteComment = async (req, res) => {
  try {
    const comment = await models.Comment.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (comment.commentImageUrl) {
      const filename = comment.commentImageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) throw err;
        console.log("Image a été supprimée!");
      });
    }
    if (req.userId && comment.UserId !== req.userId) {
      return res.sendStatus(401);
    }
    let result = await models.Comment.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result !== 1) {
      return res.status(417).json({error: `Failed to delete Comment`});
    }
    res.status(200).send({ message: "Le commentaire a été supprimé! " });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
