import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("server is runnig");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zlm1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
        await client.connect();
        console.log("db connected");
        const itemsCollection = client.db("fruitox").collection("items");

        app.get("/items", async (req, res) => {
            const cursor = itemsCollection.find({});
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        });

        // for getting single item with id
        app.get("/items/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.findOne(query);
            res.send(result);
        });

        // for adding items to db
        app.post("/additem", async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await itemsCollection.insertOne(data);
            console.log("result:", result);
            if (result.acknowledged) {
                res.send(result);
            } else {
                res.send({ acknowledged: false });
            }
        });

        app.put("/item/:id", async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            console.log(body);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: body,
            };
            const result = await itemsCollection.updateOne(
                filter,
                updateDoc,
                options
            );

            if (result.acknowledged) {
                res.send(result);
            } else {
                res.send({ acknowledged: false });
            }
        });

        app.put("/delivered/:id", async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            console.log(body);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: body,
            };
            const result = await itemsCollection.updateOne(
                filter,
                updateDoc,
                options
            );

            if (result.acknowledged) {
                res.send(result);
            } else {
                res.send({ acknowledged: false });
            }
        });
    } finally {
    }
};

run().catch(console.dir);

// listening to port 5000
app.listen(port, () => {
    console.log("Listening to port", port);
});
