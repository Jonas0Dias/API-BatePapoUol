import cors from "cors";
import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

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
    if (typeof(participant) !== 'string' || participant===""){
        res.status(422)
        return;
    }
    
    if (db.collection("participants").findOne({name: participant})){
        try{
            await db.collection("participants").insertOne({name: participant, lastStatus:Date.now()})
            await db.collection("messages").insertOne({from: participant, to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'})
        } catch{

        }
        res.status(201)
    }
 res.status(409)
})



const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));