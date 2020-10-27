let a = {b: 0}
let c= "b"
console.log(a[c])

let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
let jsonn = require('./key.json')

let formidable = require('formidable')

let rmdir = require('rimraf')

let fs = require('fs')
let key = fs.readFileSync(__dirname + '/certsFiles/selfsigned.key')
let cert = fs.readFileSync(__dirname + '/certsFiles/selfsigned.crt')
let credentials = {
    key: key,
    cert: cert
}

let express = require('express')
let app = express()
let https = require('https').createServer(credentials, app)
let httpsPort = 3002
https.listen(httpsPort, () => {
    console.log("Https server listing on port : " + httpsPort)
})

let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
    let allowedOrigins = ['https://www', 'https://']
    let origin = req.headers.origin
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', true)
    return next()
})

let mongoose = require('mongoose')

let sch = mongoose.Schema({

    username: String,
    password: String,
    ofString: [String],
    of: [String],
    payed: Boolean, default: false,
    date: Date
})

let mod = mongoose.model('users', sch)
mongoose.connect('mongodb://localhost/use', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.post('/logUp', function (req, res) {
    if (!req.body.token) {
        let token = jwt.sign({ message: 'No pass token found.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    } else {
        let use = jwt.verify(req.body.token, jsonn.key)
        let hash = bcrypt.hashSync(use.password.trim(), 10)
        mod.find({ username: use.username.trim() }).exec(function (err, user) {
            if (!user.length) {
                let b = new mod({ username: use.username.trim(), password: hash, })
                b.save(function (err, users) {
                    let token = jwt.sign({ user: users.username, pass: hash }, jsonn.key, { expiresIn: 60 * 2 })
                    return res.cookie('token', { tokenres: token }, { expires: new Date(Date.now() + 120000), secure: true, httpOnly: true }).json({ tokenres: token })
                })
            }
            else {
                let token = jwt.sign({ message: 'Username is Taken' }, jsonn.key, { expiresIn: 60 * 2 })
                return res.json({ tokenres: token })
            }
        })
    }
})

app.post('/logIn', function (req, res) {
    if (!req.body.token) {
        let token = jwt.sign({ message: 'No pass token found.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    } else {
        let users = jwt.verify(req.body.token, jsonn.key)
        mod.findOne({ username: users.username.trim() }).exec(function (err, user) {
            if (!user) {
                let token = jwt.sign({ message: 'Incorrect ' }, jsonn.key, { expiresIn: 60 * 2 })
                return res.json({ tokenres: token })
            }
            bcrypt.compare(users.password.trim(), user.password,
                function (err, valid) {
                    if (!valid) {
                        let token = jwt.sign({ message: 'Incorrect ' }, jsonn.key, { expiresIn: 60 * 2 })
                        return res.json({ tokenres: token })
                    } else if (valid) {
                        let token = jwt.sign({ user: user.username, pass: user.password }, jsonn.key, { expiresIn: 60 * 2 })
                        return res.cookie('token', { tokenres: token }, { expires: new Date(Date.now() + 120000), secure: true, httpOnly: true }).json({ tokenres: token })
                    }
                })
        })
    }
})

app.post('/tok', function (req, res) {
    if (req.cookies.token) {
        jwt.verify(req.cookies.token.tokenres, jsonn.key, function (err, user) {
            mod.findOne({ username: user.user }).exec(function (err, users) {
                if (!users) {
                    let token = jwt.sign({ message: '↜\xa0\xa0Log In  \xa0/\xa0  Sign Up' }, jsonn.key, { expiresIn: 60 * 2 })
                    return res.json({ tokenres: token })
                } else {
                    if (users.password === user.pass) {
                        let token = jwt.sign({ user: users.username }, jsonn.key, { expiresIn: 60 * 2 })
                        return res.json({ tokenres: token })
                    } else {
                        let token = jwt.sign({ message: 'Incorrect ' }, jsonn.key, { expiresIn: 60 * 2 })
                        return res.json({ tokenres: token })
                    }
                }
            })
        })
    } else {
        let token = jwt.sign({ message: '↜\xa0\xa0Log In  \xa0/\xa0 Sign Up' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    }
})

app.post('/do', function (req, res) {
    if (!req.body.token) {
        let token = jwt.sign({ message: 'No pass token found.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    } else {
        let user = jwt.verify(req.body.token, jsonn.key)
        mod.findOne({ username: user.username }).exec(function (err, users) {
            if (!users) {
                let token = jwt.sign({ message: 'Not found' }, jsonn.key, { expiresIn: 60 * 2 })
                return res.json({ tokenres: token })
            } else {
                if (users.username) {
                    if (fs.existsSync('./store/build/vid/' + users.username + '/')) {
                        rmdir('./store/build/vid/' + users.username, function (error) { })
                    }
                    mod.deleteOne({ username: users.username }, function (err) {
                        let token = jwt.sign({ message0: 'You\'re loss' }, jsonn.key, { expiresIn: 60 * 2 })
                        return res.json({ tokenres: token })
                    })
                } else {
                    let token = jwt.sign({ message: 'Not found' }, jsonn.key, { expiresIn: 60 * 2 })
                    return res.json({ tokenres: token })
                }
            }
        })
    }
})

app.post('/clear', function (req, res) {
    res.clearCookie('token')
    res.end()
})

app.post('/up', function (req, res) {
    if (!req.rawHeaders.includes('multipart/form-data;charset=UTF-8')) {
        let form = new formidable.IncomingForm()
        form.parse(req, function (err, fields, files) {
            let s = JSON.parse(fields.go)
            let user = jwt.verify(s.token, jsonn.key)
            if (fs.existsSync('./store/build/vid/' + user.username + '/')) {
                fs.readdir('./store/build/vid/' + user.username + '/', (err, names) => {
                    let n = names.includes(files.filetoupload.name)
                    if (n) {
                        fs.unlinkSync(files.filetoupload.path)
                        let token = jwt.sign({ message: 'File name taken' }, jsonn.key, { expiresIn: 60 * 2 })
                        return res.json({ tokenres: token })
                    } else {
                        let oldpath = files.filetoupload.path
                        let newpath = './store/build/vid/' + user.username + '/' + files.filetoupload.name
                        let s = String(newpath)
                        let extension = newpath.split('/').pop()
                        let gg = extension.replace(/.mp4/, '')
                        mod.updateOne({ username: user.username }, {
                            '$push': {
                                'ofString': s
                            }
                        }).exec(function (err) {
                            mod.updateOne({ username: user.username }, {
                                '$push': {
                                    'of': gg
                                }
                            }).exec(function (err) {
                                fs.rename(oldpath, newpath)
                                let token = jwt.sign({ message: 'Upload complete' }, jsonn.key, { expiresIn: 60 * 2 })
                                return res.json({ tokenres: token })
                            })
                        })
                    }
                })
            } else {
                fs.mkdirSync('./store/build/vid/' + user.username + '/')
                let oldpath = files.filetoupload.path
                let newpath = './store/build/vid/' + user.username + '/' + files.filetoupload.name
                let t = String(newpath)
                let extension = newpath.split('/').pop()
                let gg = extension.replace(/.mp4/, '')
                mod.updateOne({ username: user.username }, {
                    '$push': {
                        'ofString': t
                    }
                }).exec(function (err) {
                    mod.updateOne({ username: user.username }, {
                        '$push': {
                            'of': gg
                        }
                    }).exec(function (err) {
                        fs.rename(oldpath, newpath)
                        let token = jwt.sign({ message: 'Upload complete' }, jsonn.key, { expiresIn: 60 * 2 })
                        return res.json({ tokenres: token })
                    })
                })

            }
        })
    } else {
        let token = jwt.sign({ message: 'No form data.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    }
})

app.post('/down', function (req, res) {
    if (req.body.token) {
        let us = jwt.verify(req.body.token, jsonn.key)
        if (fs.existsSync('./store/build/vid/' + us.username + '/')) {
            fs.readdir('./store/build/vid/' + us.username + '/', (err, names) => {
                let n = names.includes(us.vidname)
                if (n) {
                    let s = String('./store/build/vid/' + us.username + '/' + us.vidname)
                    let extension = s.split('/').pop()
                    let gg = extension.replace(/.mp4/, '')
                    mod.updateOne({ username: us.username }, {
                        '$pull': {
                            'ofString': s
                        }
                    }).exec(function (err) {
                        mod.updateOne({ username: us.username }, {
                            '$pull': {
                                'of': gg
                            }
                        }).exec(function (err) {
                            fs.unlinkSync('./store/build/vid/' + us.username + '/' + us.vidname)
                            let token = jwt.sign({ message: 'Deleted \xa0' + us.vidname }, jsonn.key, { expiresIn: 60 * 2 })
                            return res.json({ tokenres: token })
                        })
                    })
                } else {
                    let token = jwt.sign({ message: 'File name unkown' }, jsonn.key, { expiresIn: 60 * 2 })
                    return res.json({ tokenres: token })
                }
            })
        } else {
            let token = jwt.sign({ message: 'File name unkown' }, jsonn.key, { expiresIn: 60 * 2 })
            return res.json({ tokenres: token })
        }
    } else if (!req.body.token) {
        let token = jwt.sign({ message: 'No pass token found.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    }
})

app.post('/g', function (req, res) {
    mod.find({}, 'username ofString').sort({ username: 1 }).exec(function (err, doc) {
        let token = jwt.sign({ message: doc }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    })
})

app.post('/gg', function (req, res) {
    if (req.body.token) {
        let us = jwt.verify(req.body.token, jsonn.key)
        mod.find({ username: us.username }, 'ofString').exec(function (err, doc) {
            let token = jwt.sign({ message: doc }, jsonn.key, { expiresIn: 60 * 2 })
            return res.json({ tokenres: token })
        })
    } else if (!req.body.token) {
        let token = jwt.sign({ message: 'No pass token found.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    }
})

app.post('/ggg', function (req, res) {
    if (req.body.token) {
        let us = jwt.verify(req.body.token, jsonn.key)
        let p = us.namev
        let pp = p.toLowerCase()
        let oo = pp.replace(/(\W\s|\s\W|\W$)/sg, '')
        if (oo.length) {
            let splited = oo.split(/\s+/gi)
            let ssss = ''
            let h = splited.length - 1
            for (let x in splited) {
                if (splited[0]) {
                    splited[0] = "(" + splited[0]
                }
                if (splited[x] === splited[h]) {
                    splited[h] = splited[h] + ")"
                }
                ssss += splited[x] + "|"
            }
            let i = ssss.lastIndexOf("|")
            let res1 = ssss.slice(0, i)
            let rrrr = new RegExp(res1, "gim")
            mod.find({ of: rrrr }, 'of  username').exec(function (err, doc) {
                if (doc.length) {
                    let h = []
                    let o = []
                    let f = []
                    for (let i = 0; i < doc.length; i++) {
                        h.push({ file: [doc[i].of, { use: doc[i].username }] })
                    }
                    for (let x in h) {
                        for (let y in h[x].file[0]) {
                            let cc = h[x].file[0][y].toLowerCase()
                            if (cc.match(rrrr)) {
                                o.push({ file: h[x].file[0][y], use: h[x].file[1].use })
                            }
                        }
                    }
                    for (let l in o) {
                        let u = " ./store/build/vid/" + o[l].use + "/" + o[l].file + ".mp4"
                        f.push(u)
                    }
                    let token = jwt.sign({ mes: f }, jsonn.key, { expiresIn: 60 * 2 })
                    return res.json({ tokenres: token })

                } else {
                    let token = jwt.sign({ message: 'File name unkown' }, jsonn.key, { expiresIn: 60 * 2 })
                    return res.json({ tokenres: token })
                }
            })
        } else {
            let token = jwt.sign({ message: 'File name unkown' }, jsonn.key, { expiresIn: 60 * 2 })
            return res.json({ tokenres: token })
        }
    } else if (!req.body.token) {
        let token = jwt.sign({ message: 'No pass token found.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    }
})

app.post('/pay', function (req, res) {
    if (req.body.token) {
        let us = jwt.verify(req.body.token, jsonn.key)
        let ddd = new Date()
        var tw = ddd.setMonth(ddd.getMonth() + 12)
        let dd = new Date(tw)
        mod.findOneAndUpdate({ username: us.username }, { date: ddd, payed: true }).exec(function (err, doc) {
            let token = jwt.sign({ message: { payed: true, date: dd } }, jsonn.key, { expiresIn: 60 * 2 })
            return res.json({ tokenres: token })
        })
    } else if (!req.body.token) {
        let token = jwt.sign({ message: 'No pass token found.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    }
})

app.post('/pa', function (req, res) {
    if (req.body.token) {
        let us = jwt.verify(req.body.token, jsonn.key)
        mod.findOne({ username: us.username }, "payed date").exec(function (err, doc) {
            if (doc.payed) {
                let dd = doc.date
                let ddd = doc.date.getUTCFullYear()
                let dddd = doc.date.getUTCMonth()
                var tw = dd.setMonth(dd.getMonth() + 13)
                var d = new Date(tw)
                var m = d.getFullYear()
                var n = d.getMonth()
                if (m >= ddd && n >= dddd) {
                    let token = jwt.sign({ message: { payed: doc.payed, date: d } }, jsonn.key, { expiresIn: 60 * 2 })
                    return res.json({ tokenres: token })
                } else {
                    mod.findOneAndUpdate({ username: us.username, payed: true }, { payed: false }).exec(function (err, doc) {
                        let token = jwt.sign({ message: { payed: false } }, jsonn.key, { expiresIn: 60 * 2 })
                        return res.json({ tokenres: token })
                    })
                }
            } else {
                let token = jwt.sign({ message: { payed: false } }, jsonn.key, { expiresIn: 60 * 2 })
                return res.json({ tokenres: token })
            }
        })
    } else if (!req.body.token) {
        let token = jwt.sign({ message: 'No pass token found.' }, jsonn.key, { expiresIn: 60 * 2 })
        return res.json({ tokenres: token })
    }
})
