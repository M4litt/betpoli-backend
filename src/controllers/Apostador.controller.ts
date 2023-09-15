import { apostadorModel } from "../models/Apostador.model";
import { apostadorVerify } from "../models/ApostadorVerify.model";
import { createHash } from 'node:crypto';
import { generarClave, verificarClave } from "../middleware/jwt";
import { isValidObjectId } from "mongoose";
const otpGenerator = require('otp-generator');
const urlApiPartidos: String = "http://172.16.255.204:6969/matches"

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
    registro(req: any, res: any) {
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

        if (!fotoRegex.test(req.body.fotoDoc.valueOf())) {
            res.status(400).send("Imagen invalida");
            return;
        }

        if(!nombreApellidoRegex.test(req.body.nombre)){
            res.status(400).send("Nombre Invalido");
            return;
        }

        if(!nombreApellidoRegex.test(req.body.apellido)){
            res.status(400).send("Apellido Invalido");
            return;
        }
        
        if(!fechaRegex.test(req.body.fechaNac) || !isValidDate(req.body.fechaNac)){
            console.log(isValidDate(req.body.fechaNac))
            res.status(400).send("Fecha de nacimiento no valida");
            return;
        }

        apostadorModel.findOne({ "DNI": req.body.DNI }).then((v) => {
            if (v == undefined) {
                apostadorModel.findOne({ "mail": req.body.mail }).then((v) => {
                    if (v == undefined) {
                       var todaladata = {
                        creado: "",
                        verify: "",
                        sendMail: ""
                       }
                       const temp: any = req.body;
                       temp["estado"] = "pendiente";
                       temp["contraseña"] = sha256(req.body.contraseña);

                        apostadorModel.create(temp).then(data => {
                            data.save()
                            todaladata.creado = JSON.stringify(data)
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
                            todaladata.verify = JSON.stringify(data)
                        });
                        sendMail(req.body.mail.valueOf(), "Verificacion del correo",
                            "Tu codigo de verificacion es: " + OTP)
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
    },
    verify(req: any, res: any) {
        apostadorVerify.findOne({ "mail" :req.body.mail}).then((v) => {
            if (v == undefined) {
                res.status(400).send("Mail no encontrado");
                return;
            }
            else {
                if (v.otp == req.body.otp) {
                    apostadorModel.findOneAndUpdate({ "mail":req.body.mail}, {$set:{"estado":"activo"}}).then((b) => {
                        apostadorVerify.deleteOne({ "mail" :req.body.mail}).then((p) => {
                            res.send("Verificacion correcta");
                        });
                    });
                }
                else {
                    res.status(400).send("Codigo incorrecto");
                }
            }
        })
    },
    login(req: any, res: any) {
        apostadorModel.findOne({ "mail": req.body.mail}).then((b) => {
            if (b) {
                if(b.estado != "activo"){
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
    Apostar(req: any, res: any){
        if(!req.body.idPartido || !req.body.monto || !req.body.resultado){
            res.status(200).send("no se proporcionaon todos los datos")
        }
        if(!isValidObjectId(req.body.idPartido)){
            res.status(200).send("id de partido invalida")
            return
        }

        fetch(urlApiPartidos + "/matches/" + req.body.idPartido, {method: "GET"})
        .then((v) => v.json())
        .then((b) => console.log(b))
        .catch((err: any) => console.error('error:' + err));
    }
}