import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import cors  from 'cors'
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser'

const prisma = new PrismaClient()

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' || req.method === 'PATCH' && req.body) {
    const oldBody = req.body 

    let newBody = {}
    Object.entries(oldBody).forEach(([key, value]) => {
      if (isNaN(value as any)) {
        (newBody as any)[key] = value
      } else {
        (newBody as any)[key] = value as any * 1
      }
    })

    req.body = newBody;
  }
  next();
})

const port = process.env.PORT;


// LOG IN

app.post('/log-in', async (req: Request, res: Response) => {

  const correctLogin = process.env.ADMIN_LOGIN === req.body.login
  const correctPassword = process.env.ADMIN_PASSWORD === req.body.password 

  if (correctLogin && correctPassword) {
    res.status(200).send()
    return
  } 

  res.status(400).send(req.body)
});

// GET ALL

app.get('/pozycje-zamowien', async (req: Request, res: Response) => {
  const pozycje =  await prisma.pozycje_zamowien.findMany();

  res.send(pozycje);
});

app.get('/klienci', async (req: Request, res: Response) => {
  const klienci =  await prisma.klienci.findMany();

  res.send(klienci);
});

app.get('/produkty', async (req: Request, res: Response) => {
  const produkty =  await prisma.produkty.findMany();

  res.send(produkty);
});

app.get('/zamowienia', async (req: Request, res: Response) => {
  const zamowienia =  await prisma.zamowienia.findMany();

  res.send(zamowienia);
});


// GET ONE

app.get('/pozycje-zamowien/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  const pozycja = await prisma.pozycje_zamowien.findUnique({where: {id_pozycji_zamowienia: parseInt(id)}});

    res.send(pozycja).status(200);
});

app.get('/klienci/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
 const klient = await prisma.klienci.findUnique({where: {id_klienta: parseInt(id)}});

    res.send(klient).status(200);
});

app.get('/produkty/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  const produkt = await prisma.produkty.findUnique({where: {id_produktu: parseInt(id)}});

  res.send(produkt).status(200);
});

app.get('/zamowienia/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  const zamowienie = await prisma.zamowienia.findUnique({where: {id_zamowienia: parseInt(id)}});

    res.send(zamowienie).status(200);
});


// DELETE

app.delete('/pozycje-zamowien/delete/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  await prisma.pozycje_zamowien.delete({where: {id_pozycji_zamowienia: parseInt(id)}});

  res.send().status(200);
});

app.delete('/klienci/delete/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  await prisma.klienci.delete({where: {id_klienta: parseInt(id)}});

  res.send().status(200);
});

app.delete('/produkty/delete/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  await prisma.produkty.delete({where: {id_produktu: parseInt(id)}});

  res.send().status(200);
});

app.delete('/zamowienia/delete/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  await prisma.zamowienia.delete({where: {id_zamowienia: parseInt(id)}});

  res.send().status(200);
});


// UPDATE


app.patch('/pozycje-zamowien/edit/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  await prisma.pozycje_zamowien.update({where: {id_pozycji_zamowienia: parseInt(id)}, data: req.body});

  res.send().status(200);
});

app.patch('/klienci/edit/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  await prisma.klienci.update({where: {id_klienta: parseInt(id)}, data: req.body});

  res.send().status(200);
});

app.patch('/produkty/edit/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  await prisma.produkty.update({where: {id_produktu: parseInt(id)}, data: {...req.body, cena: parseFloat((req.body.cena as string))}});

  res.send(req.body).status(200);
});

app.patch('/zamowienia/edit/:id', async (req: Request, res: Response) => {
  const {id} = req.params as {id: string}
  await prisma.zamowienia.update({where: {id_zamowienia: parseInt(id)}, data: {...req.body, data_zamowienia: new Date(Date.parse(req.body.data_zamowienia))}});

  res.send().status(200);
});


// INSERT


app.post('/pozycje-zamowien', async (req: Request, res: Response) => {
  await prisma.pozycje_zamowien.create({data: req.body});

  res.send().status(200);
});

app.post('/klienci', async (req: Request, res: Response) => {
  await prisma.klienci.create({data: req.body})

  res.send().status(200);
});

app.post('/produkty', async (req: Request, res: Response) => {
  await prisma.produkty.create({data: {...req.body, cena: parseFloat((req.body.cena as string))}})

  res.send().status(200);
});

app.post('/zamowienia', async (req: Request, res: Response) => {
  await prisma.zamowienia.create({data: {...req.body, data_zamowienia: new Date(Date.parse(req.body.data_zamowienia))}})

  res.send().status(200);
});



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});