const User = require('../models/user')
const mongoose = require("mongoose");
const fs = require('fs');

exports.login = (req, res) => {
    res.render('login')
}
exports.check = (req, res) => {
    User.exists({ email : req.body.email}, (err, user) => {
        if (err) {
            console.log(user)
            res.status(404).send('not found')
        } else if(user !== null) {
            console.log(user)
            req.session.loggedin = true
            req.session.email = req.body.email
            res.redirect('/models')
        } else {
            console.log(user)
            res.redirect('/login')
        }
    })
}
exports.register = (req, res) => {
    res.render('register')
}
exports.createuser =(req, res) => {
    console.log(req.body.email)
    User.exists({email : req.body.email}, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send('database error')
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
            let dir = './public/resources/uploads/' + req.body.email;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }

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

