const User = require('../models/user')
const mongoose = require("mongoose");
const ejs = require("ejs");
const util = require("../util/util")
const userTemplate = require('../templates/user.template')

exports.login = (req, res) => {
    res.render('login', {
        alerts: '' // no alerts in init
    })
}

// validate user and set session cookie
exports.check = (req, res) => {
    User.findOne({ email : req.body.email }, (err, user) => {
        if (err) {
            return res.status(500).send('database error')
        }
        if(user !== null) {
            if(user.password === req.body.password) {
                req.session.loggedin = true
                req.session.email = req.body.email
                return res.redirect('/showrooms')
            }
        }
        res.render('login', {
            alerts: ejs.render(userTemplate.alert('Wrong Credentials'))
        })
    })
}

exports.register = (req, res) => {
    res.render('register', {
        alerts: '' // no alerts in init
    })
}


exports.createUser =(req, res) => {
    User.exists({ email : req.body.email }, (err, result) => {
        if (err) {
            console.error("could not check if user exists: " + err)
            return res.status(500).send('database error')
        }
        if (result !== null) {
            return res.render('register', {
                alerts: ejs.render(userTemplate.alert('user already exists'))
            })
        }
        let user = new User()
        user.email = req.body.email
        user.password = req.body.password
        user._id = mongoose.Types.ObjectId();
        user.save((err, _) => {
            if (err) {
                console.error("Could not save user: " + err)
                return res.render("register", {
                    alerts: ejs.render(userTemplate.alert("Invalid email address : " + req.body.email))
                })
            }
            try {
                util.createDirectoryFromEmail(req.body.email)
            } catch (e) {
                User.findByIdAndDelete(user._id, (err, _) => {
                    if(err) {
                        console.log(err)
                    }
                })
                console.log("unable to register new user: " + e)
                return res.render('register', {
                    alerts: ejs.render(userTemplate.alert('unable to create directory'))
                })
            }
            res.redirect('/login')
        })
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
          return res.status(500).send('database error')
      }
      res.status(200).json(users)
    })
}