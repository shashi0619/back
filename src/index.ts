import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient, Db, Collection } from "mongodb";

type Product = {
  p_id: number;
  p_brand: string;
  p_cost: number;
  p_image: string;
};

const app = express();

// Enable CORS policy
app.use(cors());
app.use(express.json());

// Create client object
const client = new MongoClient("mongodb+srv://admin:admin@shashimern.1jmxu.mongodb.net/?retryWrites=true&w=majority&appName=shashimern");

// Helper function to get the database and collection
const getCollection = async (): Promise<Collection<Product>> => {
  await client.connect();
  const db: Db = client.db("mern_db");
  return db.collection<Product>("products");
};

// GET request
app.get("/laptops", async (req: Request, res: Response) => {
  try {
    const collection = await getCollection();
    const products = await collection.find().toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// DELETE request
app.delete("/delete", async (req: Request, res: Response) => {
  try {
    const collection = await getCollection();
    const result = await collection.deleteOne({ p_id: req.body.p_id });
    res.json({ message: result.acknowledged ? "Record deleted successfully" : "Record not deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record", error });
  }
});

// POST request
app.post("/insert", async (req: Request, res: Response) => {
  try {
    const collection = await getCollection();
    const newProduct: Product = {
      p_id: parseInt(req.body.p_id),
      p_brand: req.body.p_brand,
      p_cost: parseInt(req.body.p_cost),
      p_image: req.body.p_image,
    };
    const result = await collection.insertOne(newProduct);
    res.json({ message: result.acknowledged ? "Record inserted successfully" : "Record not inserted" });
  } catch (error) {
    res.status(500).json({ message: "Error inserting record", error });
  }
});

// PUT request
app.put("/update", async (req: Request, res: Response) => {
  try {
    const collection = await getCollection();
    const result = await collection.updateOne(
      { p_id: parseInt(req.body.p_id) },
      {
        $set: {
          p_brand: req.body.p_brand,
          p_cost: parseInt(req.body.p_cost),
          p_image: req.body.p_image,
        },
      }
    );
    res.json({ message: result.acknowledged ? "Record updated successfully" : "Record not updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating record", error });
  }
});

// Assign port number
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
