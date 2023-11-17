import { Router } from 'express';
import { JugadorController } from '../controllers/jugador.controller';
import * as admin from '../middleware/auth.admin.middleware';

export const jugadorRouter = Router();

jugadorRouter
.get   ('/',                JugadorController.getAll)
.get   ('/:id',             JugadorController.getOne)
.post  ('/',    admin.auth, JugadorController.add   )
.patch ('/:id', admin.auth, JugadorController.update)
.delete('/:id', admin.auth, JugadorController.delete)
/*
[
    {
      "nombre": "pablo",
      "apellido": "escobar",
      "edad": "30",
      "posicion": "1",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "ian",
      "apellido": "poletti",
      "edad": "30",
      "posicion": "2",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "thiago",
      "apellido": "leto",
      "edad": "30",
      "posicion": "3",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "agustin",
      "apellido": "abdala",
      "edad": "30",
      "posicion": "4",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "noelia",
      "apellido": "aversa",
      "edad": "30",
      "posicion": "5",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "tomas",
      "apellido": "barak",
      "edad": "30",
      "posicion": "6",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "tobias",
      "apellido": "tempra",
      "edad": "30",
      "posicion": "7",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "valentino",
      "apellido": "collazo",
      "edad": "30",
      "posicion": "8",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "joaco",
      "apellido": "diaz",
      "edad": "30",
      "posicion": "9",
      "dorsal": "0",
      "goles": "10"
    },
    {
      "nombre": "nicolas",
      "apellido": "vilches",
      "edad": "30",
      "posicion": "10",
      "dorsal": "0",
      "goles": "10"
    }
  ]
 */