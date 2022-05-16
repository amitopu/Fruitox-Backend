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

        // for getting all items or according to query value
        app.get("/items", async (req, res) => {
            console.log("query: ", req.query);
            const size = parseInt(req.query.size);
            const page = parseInt(req.query.page);
            const query = {};
            const cursor = itemsCollection.find(query);
            let items;
            if (page || size) {
                items = await cursor
                    .skip(page * size)
                    .limit(size)
                    .toArray();
            } else {
                items = await cursor.toArray();
            }

            res.send(items);
        });

        app.get("/items/user/:user", async (req, res) => {
            const user = req.params.user;
            const size = parseInt(req.query.size);
            const page = parseInt(req.query.page);
            const query = { supplierName: user };
            console.log(page, size, query);
            const cursor = itemsCollection.find(query);
            let items;
            if (page || size) {
                items = await cursor
                    .skip(page * size)
                    .limit(size)
                    .toArray();
            } else {
                items = await cursor.toArray();
            }
            res.send(items);
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

        app.delete("/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                res.send({ deleted: true });
            } else {
                res.send({ delete: false });
            }
        });

        app.get("/itemscount", async (req, res) => {
            const result = await itemsCollection.estimatedDocumentCount();
            res.send({ count: result });
        });

        app.get("/itemscount/:user", async (req, res) => {
            const user = req.params.user;
            const query = { supplierName: user };
            console.log(query);
            const result = await itemsCollection.countDocuments(query);
            console.log(result);
            res.send({ count: result });
        });
    } finally {
    }
};

run().catch(console.dir);

// listening to port 5000
app.listen(port, () => {
    console.log("Listening to port", port);
});
