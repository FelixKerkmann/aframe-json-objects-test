const ejs = require("ejs");
const User = require('../models/user')
const mongoose = require("mongoose");

exports.login = (req, res) => {
    res.render('login')
}
exports.check = (req, res) => {
    User.findOne({ email : req.body.email}, (err, user) => {
        if (err) {
            res.status(404).send('not found')
        } else if(user !== []) {
            console.log(req.body)
            res.redirect('/models')
        } else {
            res.redirect('/login')
        }
    })
}
exports.register = (req, res) => {
    res.render('register')
}
exports.createuser = (req, res) => {
    User.findOne({email : req.body.email}, (err, result) => {
        if (err) {
            res.status(404).send('not found')
        } else if (result !== null) {
            console.log('email already exists')
            res.redirect('/register')
        } else {
            console.log(req.body)
            let user = new User()
            user.email = req.body.email
            user.password = req.body.password
            let myId = mongoose.Types.ObjectId();
            user._id = myId
            console.log(user)
            user.save((err, userCreated) => {
                console.log(userCreated)
                if (err) {
                    res.status(412).send(err)
                } else {
                    res.redirect('/login')
                }
            })
        }
    })
}
exports.logout = (req, res) => {
    req.session.destroy((err) => {
    })
    res.redirect('/login')
}

exports.findAll = (req, res) => {
    User.find((err, users) => {
      if(err) {
          res.status(500).send('database error')
      }  else {
          res.status(200).json(users)
      }
    })
}

