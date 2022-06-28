const sr = require('../models/showroom')

exports.findById = (req, res) => {
    sr.findById(req.params.id, (err, sr) => {
        if(err) {
            res.status(404).send('not found')
        } else {
            res.status(200).json(sr)
        }
    })
}

exports.findAll = (req, res) => {
    sr.find((err, shr) => {
        if(err) {
            res.status(500).send('databese error')
        }
        else {
            res.status(200).json(shr)
        }
    })
}