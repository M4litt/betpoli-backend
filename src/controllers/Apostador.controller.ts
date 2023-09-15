import { apostadorModel } from "../models/Apostador.model";
import { apostadorVerify } from "../models/ApostadorVerify.model";
import { createHash } from 'node:crypto';
import { generarClave, verificarClave } from "../middleware/jwt";
const otpGenerator = require('otp-generator');

import { Request, Response } from "express";

//Regex
const mailRegex: RegExp = new RegExp("[A-Za-z0-9]+@[a-z]+\.[a-z]{2,3}");
const contraRegex: RegExp = new RegExp("^(?=.*[A-Z])(?=.*[0-9]).{8,}$");
const fotoRegex: RegExp = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'pedrothedeveloper@gmail.com',
        pass: 'vwltcggubmcxserj',
    },
    secure: true,
});

function sendMail(to: String, subject: String, text: String) {
    const mailData = {
        from: "pedroTheDeveloper@gmail.com",
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

function sha256(content: string) {  
    return createHash('sha256').update(content).digest('hex')
}

export default {
    registro(req: Request, res: Response) {
        if (!req.body.contraseña || !req.body.nombre || !req.body.mail || !req.body.DNI
            || !req.body.fechaNac || !req.body.apellido || !req.body.fotoDoc) {
            res.status(400).send("No se proporcionaron todos los datos");
            return;
        }

        if (!mailRegex.test(req.body.mail.valueOf())) {
            res.status(400).send("Mail invalido");
            return;
        }

        if (req.body.DNI.length != 8) {
            res.status(400).send("DNI invalido");
            return;
        }

        if (!contraRegex.test(req.body.contraseña.valueOf())) {
            res.status(400).send("Contraseña insegura");
            return;
        }
        
        if (!fotoRegex.test(req.body.fotoDoc.valueOf())) {
            res.status(400).send("Imagen invalida");
            return;
        }
        

        apostadorModel.findOne({ "DNI": req.body.DNI }).then((v) => {
            if (v == undefined) {
                apostadorModel.findOne({ "mail": req.body.mail }).then((v) => {
                    if (v == undefined) {
                        apostadorModel.create(req.body).then(data => {
                            data.save()
                            res.status(201).send(data)
                        });
                        const configOTP = {
                            lowerCaseAlphabets: false,
                            upperCaseAlphabets: false,
                            specialChars: false
                        }
                        const OTP = otpGenerator.generate(4, configOTP);
                        console.log(OTP);
                        apostadorVerify.create({"mail": req.body.mail, "otp": OTP}).then(data => {
                            data.save()
                            res.status(201).send(data)
                        });
                        sendMail(req.body.mail.valueOf(), "Verificacion del correo",
                            "Tu codigo de verificacion es: " + OTP)
                        res.send(req.body);
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
    },

    verify(req: Request, res: Response) {
        apostadorVerify.findOne({ "mail" :req.body.mail}).then((v) => {
            if (v == undefined) {
                res.status(400).send("Mail no encontrado");
                return;
            }
            else {
                if (v.otp == req.body.otp) {
                    apostadorVerify.deleteOne({ "mail" :req.body.mail});
                    apostadorVerify.findOneAndUpdate(req.body.mail, {$set:{estado:"activo"}});
                    res.send("Verificacion correcta");
                }
                else {
                    res.status(400).send("Codigo incorrecto");
                }
            }
        })
    },

    login(req: Request, res: Response) {
        apostadorModel.findOne({ "mail": req.body.mail}).then((b) => {
            if (b) {
                if(b.estado == "activo"){
                    res.status(400).send("cuenta no activada");
                    return;
                }
                apostadorModel.findOne({"mail": req.body.mail, "contraseña": sha256(req.body.contraseña)}).then((v) => {
                    if(v){
                        let respuesta: JSON = JSON.parse(JSON.stringify(b));
                        Object.assign(respuesta, { "claveJWT": generarClave(req.body.mail) });
                        res.json(respuesta);
                    }
                    else{
                        res.status(400).send("contraseña Incorrecta");
                    }
                })
            }
            else{
                res.status(400).send("mail no encontrado");
            }
        })
    },

    setStateToActive(req: Request, res: Response) {

        apostadorModel.findOne({ mail: req.body.mail })
        .then((v) => { 
            // if nothing found
            if (!v) {
                res.status(400).send("mail no encontrado");
                return;
            }

            // set state to active
            apostadorModel.findOneAndUpdate(
                { mail: req.body.mail }, 
                { $set: { 
                    estado: "activo" 
                }
            })
            .then(() => res.status(200).send("cuenta activada"))
            .catch(err => res.status(400).send(err));
            //res.send("cuenta activada");
        })
        .catch((err) => res.status(400).send("mail no encontrado"));

    }
}