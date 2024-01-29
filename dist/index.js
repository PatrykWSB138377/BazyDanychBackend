"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const prisma = new client_1.PrismaClient();
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PATCH' && req.body) {
        const oldBody = req.body;
        let newBody = {};
        Object.entries(oldBody).forEach(([key, value]) => {
            if (isNaN(value)) {
                newBody[key] = value;
            }
            else {
                newBody[key] = value * 1;
            }
        });
        req.body = newBody;
    }
    next();
});
const port = process.env.PORT;
// LOG IN
app.post('/log-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const correctLogin = process.env.ADMIN_LOGIN === req.body.login;
    const correctPassword = process.env.ADMIN_PASSWORD === req.body.password;
    if (correctLogin && correctPassword) {
        res.status(200).send();
        return;
    }
    res.status(400).send(req.body);
}));
// GET ALL
app.get('/pozycje-zamowien', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pozycje = yield prisma.pozycje_zamowien.findMany();
    res.send(pozycje);
}));
app.get('/klienci', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const klienci = yield prisma.klienci.findMany();
    res.send(klienci);
}));
app.get('/produkty', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const produkty = yield prisma.produkty.findMany();
    res.send(produkty);
}));
app.get('/zamowienia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zamowienia = yield prisma.zamowienia.findMany();
    res.send(zamowienia);
}));
// GET ONE
app.get('/pozycje-zamowien/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const pozycja = yield prisma.pozycje_zamowien.findUnique({ where: { id_pozycji_zamowienia: parseInt(id) } });
    res.send(pozycja).status(200);
}));
app.get('/klienci/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const klient = yield prisma.klienci.findUnique({ where: { id_klienta: parseInt(id) } });
    res.send(klient).status(200);
}));
app.get('/produkty/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const produkt = yield prisma.produkty.findUnique({ where: { id_produktu: parseInt(id) } });
    res.send(produkt).status(200);
}));
app.get('/zamowienia/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const zamowienie = yield prisma.zamowienia.findUnique({ where: { id_zamowienia: parseInt(id) } });
    res.send(zamowienie).status(200);
}));
// DELETE
app.delete('/pozycje-zamowien/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.pozycje_zamowien.delete({ where: { id_pozycji_zamowienia: parseInt(id) } });
    res.send().status(200);
}));
app.delete('/klienci/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.klienci.delete({ where: { id_klienta: parseInt(id) } });
    res.send().status(200);
}));
app.delete('/produkty/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.produkty.delete({ where: { id_produktu: parseInt(id) } });
    res.send().status(200);
}));
app.delete('/zamowienia/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.zamowienia.delete({ where: { id_zamowienia: parseInt(id) } });
    res.send().status(200);
}));
// UPDATE
app.patch('/pozycje-zamowien/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.pozycje_zamowien.update({ where: { id_pozycji_zamowienia: parseInt(id) }, data: req.body });
    res.send().status(200);
}));
app.patch('/klienci/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.klienci.update({ where: { id_klienta: parseInt(id) }, data: req.body });
    res.send().status(200);
}));
app.patch('/produkty/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.produkty.update({ where: { id_produktu: parseInt(id) }, data: Object.assign(Object.assign({}, req.body), { cena: parseFloat(req.body.cena) }) });
    res.send(req.body).status(200);
}));
app.patch('/zamowienia/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.zamowienia.update({ where: { id_zamowienia: parseInt(id) }, data: Object.assign(Object.assign({}, req.body), { data_zamowienia: new Date(Date.parse(req.body.data_zamowienia)) }) });
    res.send().status(200);
}));
// INSERT
app.post('/pozycje-zamowien', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.pozycje_zamowien.create({ data: req.body });
    res.send().status(200);
}));
app.post('/klienci', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.klienci.create({ data: req.body });
    res.send().status(200);
}));
app.post('/produkty', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.produkty.create({ data: Object.assign(Object.assign({}, req.body), { cena: parseFloat(req.body.cena) }) });
    res.send().status(200);
}));
app.post('/zamowienia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.zamowienia.create({ data: Object.assign(Object.assign({}, req.body), { data_zamowienia: new Date(Date.parse(req.body.data_zamowienia)) }) });
    res.send().status(200);
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
