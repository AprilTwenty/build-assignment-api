import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/users", (req, res) => {
  return res.json({message: "Server API is working 🚀"});
});

app.post("/assignments", async (req, res) => {
  const newAssignment = {
    ...req.body,
    user_id: "1",
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  };

  try {
    await connectionPool.query(
      `insert into assignments (title, content, category, user_id, created_at, updated_at, published_at)
       values ($1, $2, $3, $4, $5, $6, $7)`, 
      [
        newAssignment.title,
        newAssignment.content,
        newAssignment.category,
        newAssignment.user_id,
        newAssignment.created_at,
        newAssignment.updated_at,
        newAssignment.published_at
      ]);
      console.log(newAssignment);
    return res.status(201).json({ message: "Created assignment sucessfully" });
  } catch(error) {
    console.log(error);
    console.log(newAssignment);
    return res.status(400).json({ message: "Server could not create assignment because there are missing data from client" });
  }

})


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

const data = {
  name: "test",
  age: 16
};