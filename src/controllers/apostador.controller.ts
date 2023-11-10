import { apostadorModel } from "../models/apostador.model";
import { apostadorVerify } from "../models/apostadorVerify.model";
import { createHash } from 'node:crypto';

import { generarClave } from "../middleware/jwt";
import { isValidObjectId } from "mongoose";
import { apuestaModel } from "../models/apuesta.model";
import jwt from "jsonwebtoken";
import fs from "fs"
const otpGenerator = require('otp-generator');
export const urlApiPartidos: String = `${process.env.API_PROTOCOL}://${process.env.API_DOMAIN}:${process.env.API_PORT}`;

function isValidDate(dateString: string): boolean {
    const dateParts = dateString.split("-");

    if (dateParts.length !== 3) {
        return false;
    }

    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false;
    }

    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

//Regex
const mailRegex: RegExp = new RegExp("[A-Za-z0-9]+@[a-z]+\.[a-z]{2,3}");
const contraRegex: RegExp = new RegExp("^(?=.*[A-Z])(?=.*[0-9]).{8,}$");
const fotoRegex: RegExp = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/][AQgw]==|[A-Za-z0-9+/]{2}[AEIMQUYcgkosw048]=)?$");
const fechaRegex: RegExp = new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}")
const nombreApellidoRegex: RegExp = new RegExp("^[A-Za-z]{1,25}$")

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
    secure: true,
});

function sendMail(to: String, subject: String, text: String) {
    const mailData = {
        from: process.env.NODEMAILER_EMAIL,
        subject: subject,
        to: to,
        text: text,
        html: '<b>Hola! </b> <br>' + text + ' <br/>',
    }

    transporter.sendMail(mailData, function (err: any, info: any) {
        if (err) console.log(err);
        else console.log(info);
    })
}

export function sha256(content: string) {
    return createHash('sha256').update(content).digest('hex')
}

export class ApostadorController {

    public static registro(req: any, res: any) {
        if (!req.body.contraseña || !req.body.nombre || !req.body.mail || !req.body.DNI
            || !req.body.fechaNac || !req.body.apellido || !req.body.fotoDoc) {
            res.status(400).send("No se proporcionaron todos los datos");
            return;
        }

        if (!mailRegex.test(req.body.mail.valueOf())) {
            res.status(400).send("Mail invalido");
            return;
        }

        if (req.body.DNI.length != 8 || isNaN(Number(req.body.DNI))) {
            res.status(400).send("DNI invalido");
            return;
        }

        if (!contraRegex.test(req.body.contraseña.valueOf())) {
            res.status(400).send("Contraseña insegura");
            return;
        }

        const foto: String = String(req.body.fotoDoc)
        if (!fotoRegex.test(foto.split(";base64,")[1])) {
            res.status(400).send("Imagen invalida");
            return;
        }

        if (!nombreApellidoRegex.test(req.body.nombre)) {
            res.status(400).send("Nombre Invalido");
            return;
        }


        if (!nombreApellidoRegex.test(req.body.apellido)) {
            res.status(400).send("Apellido Invalido");
            return;
        }

        if (!fechaRegex.test(req.body.fechaNac) || !isValidDate(req.body.fechaNac)) {
            console.log(isValidDate(req.body.fechaNac))
            res.status(400).send("Fecha de nacimiento no valida");
            return;
        }

        apostadorModel.findOne({ "DNI": req.body.DNI }).then((v) => {
            if (v == undefined) {
                apostadorModel.findOne({ "mail": req.body.mail }).then((v) => {
                    if (v == undefined) {

                        let base64image: any = foto.split(";base64,").pop()
                        fs.writeFile("img/perfil/" + req.body.DNI + "_perfil.png", base64image, { encoding: 'base64' }, function (err) {
                            console.log('File created');
                        });
                        var todaladata = {
                            creado: "",
                            verify: "",
                            sendMail: ""
                        }
                        const temp: any = req.body;
                        temp["estado"] = "pendiente";
                        temp["contraseña"] = sha256(req.body.contraseña);
                        temp["fotoDoc"] = "img/perfil/" + req.body.DNI + "_perfil.png"

                        apostadorModel.create(temp).then(data => {
                            data.save()
                            todaladata.creado = JSON.stringify(data)
                        });
    
                        sendMail(
                            req.body.mail.valueOf(), 
                            "Verificacion del correo",
                            `Pincha el enlace para activar la cuenta: ${process.env.API_PROTOCOL}://${process.env.API_DOMAIN}:${process.env.API_PORT}/usuario/verify/${req.body.mail}`
                        )
                        todaladata.sendMail = req.body
                        res.send(todaladata);
                    }
                    else {
                        res.status(400).send("Mail ya en uso");
                    }
                })
            }
            else {
                res.status(400).send("DNI ya en uso");
            }
        })
    }

    public static verify(req: any, res: any) {
        apostadorVerify.findOne({ "mail": req.body.mail }).then((v) => {
            if (v == undefined) {
                res.status(400).send("Mail no encontrado");
                return;
            }
            else {
                if (v.otp == req.body.otp) {
                    apostadorModel.findOneAndUpdate({ "mail": req.body.mail }, { $set: { "estado": "activo" } }).then((b) => {
                        apostadorVerify.deleteOne({ "mail": req.body.mail }).then((p) => {
                            res.send("Verificacion correcta");
                        });
                    });
                }
                else {
                    res.status(400).send("Codigo incorrecto");
                }
            }
        })
    }

    public static login(req: any, res: any) {
        apostadorModel.findOne({ "mail": req.body.mail }).then((b) => {
            if (b) {
                if (b.estado != "activo") {
                    res.status(400).send("cuenta no activada");
                    return;
                }
                apostadorModel.findOne({ "mail": req.body.mail, "contraseña": sha256(req.body.contraseña) }).then((v) => {
                    if (v) {
                        let respuesta: JSON = JSON.parse(JSON.stringify(b));
                        Object.assign(respuesta, { "claveJWT": generarClave(req.body.mail) });
                        res.json(respuesta);
                    }
                    else {
                        res.status(400).send("contraseña Incorrecta");
                    }
                })
            }
            else {
                res.status(400).send("mail no encontrado");
            }
        })
    }
    public static apostar(req: any, res: any) {
        if (!req.body.idPartido || !req.body.monto || !req.body.golesVisitante || !req.body.golesLocal) {
            res.status(400).send("no se proporcionaron todos los datos")
            return
        }

        if (!isValidObjectId(req.body.idPartido)) {
            res.status(400).send("id de partido invalida")
            return
        }

        if (isNaN(Number(req.body.golesVisitante)) || Number(req.body.golesVisitante) < 0) {
            res.status(400).send("formato de los goles visitantes invalido")
            return
        }

        if (isNaN(Number(req.body.golesLocal)) || Number(req.body.golesLocal) < 0) {
            res.status(400).send("formato de los goles locales invalido")
            return
        }

        if (isNaN(Number(req.body.monto)) || Number(req.body.monto) < 100) {
            res.status(400).send("monto invalido")
            return
        }

        const mailUsuario: String = JSON.parse(JSON.stringify(jwt.verify(req.headers.authorization, process.env.JWT_SECRET!))).mail

        apuestaModel.findOne({ mailUsuario: mailUsuario, idPartido: req.body.idPartido }).then((v) => {
            console.log(v)
            if (v) {
                res.status(400).send("Este usuario ya aposto")
                return
            }
            else {
                fetch(urlApiPartidos + "/matches/single/" + req.body.idPartido, { method: "GET" })
                    .then((v) => v.json())
                    .then((b) => {
                        let todaData: any = req.body;
                        todaData["mailUsuario"] = mailUsuario;
                        todaData["estado"] = "abierta";
                        console.log(todaData)
                        apuestaModel.create(todaData)
                        res.send("Apuesta subida correctamente")
                    })
                    .catch((err: any) => {
                        console.error('error: ' + err)
                        res.status(400).send("Partido inexistente")
                    });
            }
        })
    }

    // Alta, baja y modificacion
    public static getAll(req: any, res: any) {
        apostadorModel.find().then((v) => {
            res.send(v);
        })
    }

    public static getOne(req: any, res: any) {
        if (!req.params.DNI) {
            res.status(400).send("No se proporciono un DNI");
            return;
        }
        if (req.params.DNI.length != 8 || isNaN(Number(req.params.DNI))) {
            res.status(400).send("DNI invalido");
            return;
        }

        apostadorModel.find({ DNI: req.params.DNI }).then((v) => {
            res.send(v);
        })
    }

    public static delete(req: any, res: any) {
        if (!req.params.DNI) {
            res.status(400).send("No se proporciono un DNI");
            return;
        }
        if (req.params.DNI.length != 8 || isNaN(Number(req.params.DNI))) {
            res.status(400).send("DNI invalido");
            return;
        }

        apostadorModel.findOne({ DNI: req.params.DNI }).then((v) => {
            if (v == undefined) {
                res.status(400).send("Usuario inexistente");
                return;
            }
            apostadorModel.deleteOne({ DNI: req.params.DNI }).then((b) => {
                res.send("Usuario eliminado correctamente");
            })
        })
    }

    public static post(req: any, res: any) {
        if (!req.body.contraseña || !req.body.nombre || !req.body.mail || !req.body.DNI
            || !req.body.fechaNac || !req.body.apellido || !req.body.fotoDoc) {
            console.log(req.body)
            res.status(400).send("No se proporcionaron todos los datos");
            return;
        }

        if (!mailRegex.test(req.body.mail.valueOf())) {
            res.status(400).send("Mail invalido");
            return;
        }

        if (req.body.DNI.length != 8 || isNaN(Number(req.body.DNI))) {
            res.status(400).send("DNI invalido");
            return;
        }

        if (!contraRegex.test(req.body.contraseña.valueOf())) {
            res.status(400).send("Contraseña insegura");
            return;
        }

        const foto: String = String(req.body.fotoDoc)
        if (foto.includes(",")) {
            if (!fotoRegex.test(foto.split(",")[1])) {
                res.status(400).send("Imagen invalida1");
                return;
            }
        }
        else {
            if (!fotoRegex.test(foto.valueOf())) {
                res.status(400).send("Imagen invalida2");
                return;
            }
        }

        if (!nombreApellidoRegex.test(req.body.nombre)) {
            res.status(400).send("Nombre Invalido");
            return;
        }

        if (!nombreApellidoRegex.test(req.body.apellido)) {
            res.status(400).send("Apellido Invalido");
            return;
        }

        if (!fechaRegex.test(req.body.fechaNac) || !isValidDate(req.body.fechaNac)) {
            console.log(fechaRegex.test(req.body.fechaNac));
            console.log(isValidDate(req.body.fechaNac));
            res.status(400).send("Fecha de nacimiento no valida");
            return;
        }

        apostadorModel.findOne({ DNI: req.body.DNI }).then((v) => {
            if (v != undefined) {
                res.status(400).send("DNI ya en uso");
                return;
            }
            apostadorModel.findOne({ mail: req.body.mail }).then((b) => {
                if (b != undefined) {
                    res.status(400).send("Mail ya en uso");
                    return;
                }
                let foto: String = String(req.body.fotoDoc)
                let base64image: any = foto.split(";base64,").pop()
                fs.writeFile("img/perfil/"+req.params.DNI + "_perfil.png", base64image, {encoding: 'base64'}, function(err) {
                    console.log('File created');
                });
                const usuario: any = req.body;
                usuario["estado"] = "pendiente";
                usuario["contraseña"] = sha256(usuario["contraseña"]);
                usuario["fotoDoc"] = "img/perfil/"+req.params.DNI + "_perfil.png";
                console.log(usuario);
                apostadorModel.create(usuario).then((c) => res.send("usuario subido correctamente"))
            })
        })
    }
    public static modify(req: any, res: any) {
        if (!req.params.DNI) {
            res.status(400).send("No se proporciono un DNI");
            return;
        }
        if (req.params.DNI.length != 8 || isNaN(Number(req.params.DNI))) {
            res.status(400).send("DNI invalido");
            return;
        }

        apostadorModel.find({ DNI: req.params.DNI }).then((v) => {
            if (v.length == 0) {
                res.status(400).send("Usuario inexistente")
                return
            }
            var query: any = {}
            if (req.body.nombre) {
                if (!nombreApellidoRegex.test(req.body.nombre)) {
                    res.status(400).send("Nombre Invalido");
                    return;
                }
                query["nombre"] = req.body.nombre
            }
            if (req.body.apellido) {
                if (!nombreApellidoRegex.test(req.body.apellido)) {
                    res.status(400).send("Apellido Invalido");
                    return;
                }
                query["apellido"] = req.body.apellido
            }
            if (req.body.contraseña) {
                if (!contraRegex.test(req.body.contraseña.valueOf())) {
                    res.status(400).send("Contraseña insegura");
                    return;
                }
                query["contraseña"] = sha256(req.body.contraseña)
            }
            if (req.body.estado) {
                if (req.body.estado != "activo" && req.body.estado != "pendiente") {
                    res.status(400).send("Estado no valido")
                    return
                }
                query["estado"] = req.body.estado
            }
            if (req.body.fechaNac) {
                if (!fechaRegex.test(req.body.fechaNac) || !isValidDate(req.body.fechaNac)) {
                    console.log(fechaRegex.test(req.body.fechaNac));
                    console.log(isValidDate(req.body.fechaNac));
                    res.status(400).send("Fecha de nacimiento no valida");
                    return;
                }
                query["fechaNac"] = req.body.fechaNac
            }
            if (req.body.fotoDoc) {
                if (!fotoRegex.test(req.body.fotoDoc.valueOf())) {
                    res.status(400).send("Imagen invalida");
                    return;
                }
                query["fotoDoc"] = "img/perfil/" + req.params.DNI + "_perfil.png"
            }
            if (req.body.mail) {
                if (!mailRegex.test(req.body.mail.valueOf())) {
                    res.status(400).send("Mail invalido");
                    return;
                }
                apostadorModel.findOne({ mail: req.body.mail }).then((b) => {
                    console.log(b)
                    if (b != undefined && b.DNI != req.params.DNI) {
                        res.status(400).send("mail ya en uso")
                        return;
                    }
                    query["mail"] = req.body.mail
                    console.log("query2")
                    console.log(query)
                    apostadorModel.updateOne({ DNI: req.params.DNI }, { $set: query }).then((v) => {
                        let foto: String = String(req.body.fotoDoc)
                        let base64image: any = foto.split(";base64,").pop()
                        fs.writeFile("img/perfil/" + req.params.DNI + "_perfil.png", base64image, { encoding: 'base64' }, function (err) {
                            console.log('File created');
                        });
                        res.send(v)
                        return;
                    })
                })
            }
            else {
                console.log("query1")
                console.log(query)
                apostadorModel.updateOne({ DNI: req.params.DNI }, { $set: query }).then((v) => {
                    let foto: String = String(req.body.fotoDoc)
                    let base64image: any = foto.split(";base64,").pop()
                    fs.writeFile("img/perfil/" + req.params.DNI + "_perfil.png", base64image, { encoding: 'base64' }, function (err) {
                        console.log('File created');
                    });
                    res.send(v)
                })
            }
        })
    }
}