const User = require('../models/user')
const mongoose = require("mongoose");
const fs = require('fs');
const ejs = require("ejs");
const template = require('../templates/user.template')

exports.login = (req, res) => {
    res.render('login', {
        alerts: ''
    })
}
exports.check = (req, res) => {
    User.findOne({ email : req.body.email}, (err, user) => {
        if (err) {
            console.log(user)
            res.status(404).send('not found')
        } else if(user !== null) {
            if(user.password === req.body.password) {
                req.session.loggedin = true
                req.session.email = req.body.email
                res.redirect('/showroom')
            } else {
                res.render('login', {
                    alerts: ejs.render(template.alert('Wrong Credentials'))
                })
            }

        } else {
            res.render('login', {
                alerts: ejs.render(template.alert('user does not exist'))
            })
        }
    })
}
exports.register = (req, res) => {
    res.render('register', {
        alerts: ''
    })
}
exports.createuser =(req, res) => {
    console.log(req.body.email)
    User.exists({email : req.body.email}, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send('database error')
        } else if (result !== null) {
            res.render('register', {
                alerts: ejs.render(template.alert('user already exists'))
            })
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

