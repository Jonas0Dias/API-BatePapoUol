import cors from "cors";
import express, { response } from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.DATABASE_URL) //criando uma nova instância do mongo

let db;

try {
await mongoClient.connect();
} catch (err) {
console.log("Erro no mongo.conect", err.message);
}

db = mongoClient.db();
const participants = db.collection("participants"); // cria a coleção participants
const messages = db.collection("messages"); // cria a coleção messages


app.post('/participants', async (req, res) => {
    const participant = req.body.name // recebi os dados que vem no body quando alguem faz uma requisição post
    const date = dayjs().format("HH:mm:ss");

    if (typeof(participant) !== 'string' || participant===""){
        res.status(422).send('O usuario deve ser um texto e não pode ser vazio')
        return;
    }
    const check = await db.collection("participants").findOne({name: participant})

    if (!check){
        db.collection("participants").insertOne({name: participant, lastStatus:Date.now()})
        db.collection("messages").insertOne({from: participant, to: 'Todos', text: 'entra na sala...', type: 'status', time: date})
        res.status(201)
        return;
    }

    res.status(409).send('Usuário já existe')
})

app.get('/participants', async (req, res) => {
    const participantsList = await db.collection("participants").find().toArray()
    res.send(participantsList)
})

const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));