const models = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Signup
exports.signup = async (req, res) => {
  try {
    models.User.findOne({where: {email:req.body.email}})
    .then( async (user)=> { // if null then the user does not exist

        if(!user) { // user does not exist
            // Add User
            let hash = await bcrypt.hash(req.body.password, 10);    // Hash Password
            const user = {
                ...req.body,
                password: hash,
                roles: req.body.roles ? req.body.roles : false,
            };
        
            models.User.create(user)
                .then((user)=> {
                    return res.status(201).json({message: "User Created Successfully"});
                })
                .catch((error)=>{ res.json({error: !parseInt(error) ? "Could not create user" : error})})
        } else { // user already exist
            return res.status(409).json({error: "User already exist"});
        }
    })
    .catch((error)=> {
        res.json({error: !parseInt(error) ? "Could not verify user" : error});
    })
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

// login
exports.login = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ error: "Utilisateur introuvable avec cette adresse email !" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: "Mot de passe incorrecte !" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.TOKEN, { expiresIn: "24h" });
    res.status(200).send({ userId: user.id,
                'roles': user.roles,
                'username': user.username,
                'token': token });
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get one profile
exports.getProfile = async (req, res) => {
  try {
    console.log(req.userId);
    const user = await models.User.findOne({
      attributes: {exclude: ['password']},
      where: {
        id: req.userId,
      },
    });
    if(!user) {
      return res.status(404).json({error: "user not found"});
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update a profile
exports.updateProfile = async (req, res) => {
  try {
    if (req.file) {
      const user = await models.User.findOne({
        where: {
          id: req.userId,
        },
      });
    console.log('stuf');

      if(!user) {
        return res.status(404).json({error: "User not Found"});
      }
      console.log(typeof user.profile);
      if(user.profile) {
        const filename = user.profile.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
          console.log("Image has been deleted");
        });
      }
    }

    const userObject = req.file
      ? {
          ...JSON.parse(req.body.user),
          profile: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : {
          ...req.body,
        };
    console.log(userObject);
    console.log("here now");

    let num = await models.User.update(userObject,
      {
        where: {
          id: req.userId,
        },
      }
    );
    if (num[0] !== 1) {
      return res.status(400).json({error: `Failed to update User`});
    }

    res.status(200).send({ message: "Profile has been updated !" });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Delete a profile
exports.deleteProfile = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if(!user) {
      return res.status(404).json({error: "User not Found"});
    }
    console.log("here");
    console.log(user.profile)
    if(user.profile !== 'null') {
      console.log("enter")
      const filename = user.profile.split("/images/")[1];
      fs.unlink(`images/${filename}`, (error) => {
        if(error) { return res.status(500).json({error: error})}
        models.User.destroy({ where: { id: req.userId }}).then(result => {
          if (result !== 1) {
            return res.status(400).json({error: `Failed to delete User`});
          }
          return res.status(200).json({message: "User Deleted successfully."});
        })
      });
    } else {
      console.log("in else")
      models.User.destroy({ where: { id: req.userId }}).then(result => {
        if (result !== 1) {
          return res.status(400).json({error: `Failed to delete User`});
        }
        return res.status(200).json({message: "User Deleted successfully."});
      });
    }
    
  } catch (err) {
    res.status(500).send(err);
  }
};
