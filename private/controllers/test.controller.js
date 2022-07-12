const test = require('../models/test')
const mongoose = require("mongoose");
const ejs = require("ejs")
const json2html = require("node-json2html");

exports.test = (req, res) => {
    const doc = new test ({
        name: "Test 2",
        room: "room1",
        light: [["1","1"],["2","2"]],
        objects: [{
                entity: "entity",
                fname: "fname",
                positionx: 1,
                positiony: 2,
                positionz: 3,
                rotationx: 4,
                rotationy: 5,
                rotationz: 6,
                scale: 7
            },
            {
                entity: "entity2",
                fname: "fname2",
                positionx: -1,
                positiony: -2,
                positionz: -3,
                rotationx: -4,
                rotationy: -5,
                rotationz: -6,
                scale: -7
            }],
        _id: mongoose.Types.ObjectId()
    })
    /*
    doc.save((err, testcreated) => {
        if (err) {
            console.log(err)
            res.status(412).send(err)
        }
    })
    */
    test.find((err, result) => {
        if(err) {
            res.status(500).send('databese error')
        }
        else {
            console.log(result)
            console.log(result[0])
            console.log(result[0].objects)
            const testobj = result[0].objects
            let html = json2html.render(testobj, testtemplate)
            console.log(html)
            /*
            res.render('test', {
                test: ejs.render(html)
            })

             */
            res.send(html)
        }
    })
}

testtemplate = {
    '<>' : 'div',
    'html': '${fname}'
}