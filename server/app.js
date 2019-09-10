const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const fs = require('fs')
const bcrypt = require("bcrypt")
const colors = require('colors')
const expressJWT = require("express-jwt")
const meetUp = express();
const cors = require('cors')
var https = require('https')

const rawFile = fs.readFileSync('secrets.json')
const secrets = JSON.parse(rawFile)

meetUp.use(bodyParser.json())
meetUp.use(cors());

meetUp.use(express.static("../front-end/meetUp"))

meetUp.use(expressJWT({secret: secrets["jwt_clave"]}).unless({path: ['/login', '/register', /^\/user\/.*/]}))

//cargamos modelo de mongoose

const User = require('./models/users');
const Event = require('./models/events');




function checkRegistryData(name, email, password) {

    let nameCorrect = validateName(name);
    let emailCorrect = validateEmail(email);
    let passwordCorrect = validatePassword(password);

    if (!emailCorrect || !nameCorrect || !passwordCorrect) {
        return false;
    } else {
        return true;
    }

}

function validatePassword(password) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/.test(password)) {
        return (true)
    } else {
        return (false)
    }
}

function validateName(name) {
    if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) {
        return (true)
    } else {
        return (false)
    }
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    } else {
        return (false)
    }
}

function currentTime() {
    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }

    var d = new Date;
    dformat = [
        d.getDate().padLeft(),
        (d.getMonth() + 1).padLeft(),
        d.getFullYear()
    ].join('/') + ' ' + [d.getHours().padLeft(),
        d.getMinutes().padLeft(),
        d.getSeconds().padLeft()
    ].join(':');
    return dformat;
}

//conectamos con mongoose

// mongoose.connect("mongodb://localhost/meetUp", {
mongoose.connect(`mongodb+srv://Eric:${secrets["atlas"]}@meetup-fullstack-1ciwb.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true
}, (err) => {
    if (err) throw err

    console.log("Estoy conectado a mongoDB a través de Mongoose")

    //GET ALL USERS
    meetUp.get("/users", (req, res) => {
        //si dejamos en blanco (no añadimos) el campo de la query en el 'find', busca todos los resultados
        User.find((err, data) => {
            console.log(data)
            res.send(data)
        })
    })


    //GET SINGLE USER
    meetUp.get("/user/:id", (req, res) => {
        console.log("received GET at /user/"+req.params.id)
        User.find({
            _id: req.params.id
        }, (err, data) => {
            console.log("userID after search:", req.params.id)
            console.log("userdata",data)
            res.send(data)
        })
    })

    //REGISTER
    meetUp.post("/register", (req, res) => {
        //creamos un nuevo objecto usando el modelo creado antes
        console.log("he recibido post en /register".red)
        // if (req.body.name != null && req.body.email != null && req.body.password != null) {

        //comprobamos que los datos introducidos son correctos
        if (checkRegistryData(req.body.name, req.body.email, req.body.password)) {
            User.find({
                "email": req.body.email
            }, (err, data) => {
                if (data.length == 0) {
                    bcrypt.hash(req.body["password"], 13, (err, hash) => {

                        let newUser = new User({
                            "_id": mongoose.Types.ObjectId(),
                            "name": req.body.name,
                            "email": req.body.email,
                            "password": hash,
                            "creationDate": new Date /* currentTime() */
                        })
                        newUser.save((err) => {
                            if (err) throw err
                            console.log("Saved!")
                            //Para devolver los datos de usuario (para el token) sin el hash del password
                            delete newUser.password;
                            res.send({
                                "status": "OK",
                                "message": "Usuario añadido correctamente",
                                "userData": newUser
                            })
                        });
                    })
                } else {
                    res.send({
                        "status": "Error",
                        "message": "Ya existe un usuario con ese email"
                    })
                }
            })
        } else {
            res.send({
                "status": "Error",
                "message": "Missing parameters"
            })
        }
    })


    //LOGIN
    meetUp.post('/login', (req, res) => {
        console.log("he recibido post en /login".red)

        if (req.body.email != null && req.body.password != null) {
            User.find({
                "email": req.body.email
            }, (err, data) => {
                if (data.length == 0) {
                    res.send({
                        "status": "Error",
                        "message": "No existe ningún usuario con ese email"
                    })
                } else {
                    bcrypt.compare(req.body["password"], data[0]["password"], (err, result) => {
                        if (!result) {
                            res.send({
                                "status": "Error",
                                "message": "Email or password incorrect"
                            })

                        } else {
                            jwt.sign({
                                "username": req.body["email"]
                            }, secrets["jwt_clave"], (err, token) => {
                                if (err) throw err;
                                console.log("Login correct".green)
                                res.send({
                                    "status": "OK",
                                    "message": "Login correct",
                                    "token": token,
                                    "userId": data[0]["_id"],
                                    "email": data[0]["email"]
                                })
                            })
                        }
                    })
                }
            })
        } else {
            res.send({"status": "Error", "message":"Missing params"})
        }
    })

    //UPDATE USER

    meetUp.put("/users", (req, res) => {
        console.log(`received PUT on /users with body: ${req.body}`.red)
        let query = {
            _id: req.body["_id"]
        };
        let datosFinales = {}
        for (let i = 0; i < Object.keys(req.body).length; i++) {
            datosFinales[Object.keys(req.body)[i]] = req.body[Object.keys(req.body)[i]]            
        }
        console.log(datosFinales)
/*         datosFinales = {
            "_id": req.body.id,
            "name": req.body.name,
            "email": req.body.email,
        }; */
        console.log(datosFinales)
        let changes = {
            $set: datosFinales
        };
        console.log("changes:", changes)

        let options = {
            multi: true
        }

        User.updateOne(query, changes, options, (err, log) => {
            if (err) throw err
            console.log(log)
            res.send(log)
            //el objeto modificado lo tenemos en "datosFinales"
        })
    })


    //DELETE USER
    meetUp.delete("/users/:id", (req, res) => {
        User.findOneAndDelete({
            "_id": req.params.id
        }, (err, log) => {
            if (err) throw err
            res.send({
                "status": "OK",
                "message": "Usuario eliminado"
            })
        })
    })


    //EVENTS

    meetUp.get("/events", (req, res) => {
        //si dejamos en blanco (no añadimos) el campo de la query en el 'find', busca todos los resultados
        Event.find((err, data) => {
            console.log(data)
            res.send(data)
        })
    })

    meetUp.get("/events/:id", (req, res) => {
        Event.find({
            _id: req.params.id
        }, (err, data) => {
            console.log(data)
            res.send(data)
        })
    })


    meetUp.post("/events", (req, res) => {
        console.log("He recibido post a /events".red)
        Event.find({
            title: req.body.title,
            eventData: req.body.eventDateStart
        }, (err, data) => {
            if (err) throw err
            let creationDate = new Date;
            creationDate.setHours(creationDate.getHours() - 2)
            if (data.length == 0) {
                let newEvent = new Event({
                    _id: mongoose.Types.ObjectId(),
                    title: req.body.title,
                    organizer: req.body.organizer,
                    eventDateStart: req.body.eventDateStart,
                    eventEndStart: req.body.eventEndStart,
                    eventPlace: req.body.eventPlace,
                    mainImage: req.body.mainImage,
                    description: req.body.description,
                    creationDate: creationDate,
                    attendants: [...req.body.attendants]
                })
                console.log("Evento nuevo a añadir:", newEvent)
                newEvent.save((err) => {
                    if (err) throw err
                    res.send({
                        "status": "OK",
                        "message": "Evento añadido",
                        "data": newEvent
                    })
                })
            } else {
                res.send({
                    "status": "Error",
                    "message": "There is already an event for that day with the same name."
                })
            }
        })
    })

    meetUp.put("/events", (req, res) => {
        let query = {
            _id: req.body.id
        };

        let datosFinales = {
            "title": req.body.title,
            "organizer": req.body.organizer,
            "eventDate": req.body.date,
            "eventPlace": req.body.place
        };

        let changes = {
            $set: datosFinales
        };

        let options = {
            multi: true
        }


        Event.updateOne(query, changes, options, (err, log) => {
            if (err) throw err
            res.send(log)
            //el objeto modificado lo tenemos en "datosFinales"
        })
    })

    meetUp.put("/attend", (req, res) => {
        Event.find({
            _id: req.body.eventID
        }, (err, eventData) => {
            if (err) throw err;
            if (eventData.length == 0) {
                res.send({
                    "status": "Error",
                    "message": "Error. No event with that ID exists"
                })
            } else {
                User.find({
                    _id: req.body.userID
                }, (err, userData) => {
                    if (err) throw err;

                    let event = eventData[0];
                    let user = userData[0];
                    let alreadyAttends = false;
                    for (let i = 0; i < event.attendants.length; i++) {
                        if (event.attendants[i]["_id"] == req.body.userID) {
                            alreadyAttends = true;
                        }
                    }
                    if (alreadyAttends) {
                        res.send({
                            "status": "Error",
                            "message": "El usuario ya está apuntado a este evento"
                        })
                    } else {
                        event.attendants.push({
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            profileImage: user.profileImage
                        })
                        event.save((err) => {
                            if (err) throw err
                            res.send({
                                "status": "OK",
                                "message": "Usuario apuntado al evento con éxito",
                                "data": event
                            })
                        })
                    }

                })

            }

        })
    })


    meetUp.put("/reject", (req, res) => {
        Event.find({
            _id: req.body.eventID
        }, (err, eventData) => {
            if (err) throw err;
            if (eventData.length == 0) {
                res.send({
                    "status": "Error",
                    "message": "Error. No event with that ID exists"
                })
            } else {
                User.find({
                    _id: req.body.userID
                }, (err, userData) => {
                    if (err) throw err;

                    let event = eventData[0];
                    let user = userData[0];
                    let alreadyNotAttending = false;
                    for (let i = 0; i < event.notAttending.length; i++) {
                        if (event.notAttending[i]["_id"] == req.body.userID) {
                            alreadyNotAttending = true;
                        }
                    }
                    if (alreadyNotAttending) {
                        res.send({
                            "status": "Error",
                            "message": "El usuario ya está apuntado como no asistente a este evento"
                        })
                    } else {
                        event.notAttending.push({
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            profileImage: user.profileImage
                        })
                        event.save((err) => {
                            if (err) throw err
                            res.send({
                                "status": "OK",
                                "message": "Usuario apuntado como no asistente al evento con éxito",
                                "data": event
                            })
                        })
                    }

                })

            }

        })
    })



    meetUp.put("/withdraw", (req, res) => {
        Event.find({
            _id: req.body.eventID
        }, (err, data) => {
            if (err) throw err;
            if (data.length == 0) {
                res.send({
                    "status": "Error",
                    "message": "No event with that ID exists"
                })
            } else {
                let event = data[0];
                console.log("event:", event)
                let position = -1;
                for (let i = 0; i < event.attendants.length; i++) {
                    
                    console.log("attendantID:", event.attendants[i]["_id"])
                    console.log("userID:", req.body.userID)
                    if(event.attendants[i]["_id"] == req.body.userID) {
                        console.log("is attending")
                        position = i;
                    }
                    
                }
                // let position = event.attendants.indexOf(req.body.userID)
                // console.log(isAttending)
                if (position >= 0) {
                    event.attendants.splice(position, 1);
                    event.save((err) => {
                        if (err) throw err
                        res.send({
                            "status": "OK",
                            "message": "Usuario desapuntado del evento con éxito",
                            "data":event
                        })
                    })
                } else {
                    res.send({
                        "status": "Error",
                        "message": "Este usuario no era un asistente del evento"
                    })
                }
            }

        })
    })

    meetUp.delete("/events/:id", (req, res) => {
        Event.findOneAndDelete({
            "_id": req.params.id
        }, (err, log) => {
            if (err) throw err
            res.send({
                "status": "OK",
                "message": "Evento eliminado"
            })
        })
    })

    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
      }, meetUp)


    meetUp.listen(80, ()=> {
        console.log("Escuchando por el puerto 80")
    })

    meetUp.listen(3000, () => {
        console.log("Escuchando por el puerto 3000")
    })
})