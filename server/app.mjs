import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

/* not req in api doc
app.get("/users", async (req, res) => {
  try {
    const result = await connectionPool.query(`SELECT * FROM users`);
    return res.status(200).json({"message": "Server API is working 🚀", "data": result.rows});
  } catch(error) {
    return res.status(500).json({message: "cannot connect to sever"});
  }
  
});
*/

app.post("/assignments", async (req, res) => {
  const newAssignment = {
    ...req.body,
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  };

  try {
    const result = await connectionPool.query(
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

    if (result.rowCount < 1) {
      return res.status(202).json({ message: "Unable to create new data. The system did not find any related information or encountered an error in the process. Please check again." });
    }
      // ------------------------ test section-----------
      //console.log(newAssignment);
      //console.log(result);
      //-------------------------------------------------

    return res.status(201).json({ message: "Created assignment sucessfully" });
  } catch(error) {

      // ------------------------ test section-----------
      //console.log(error.column);
      //console.log(newAssignment);
      //-------------------------------------------------

    if (error.column != "") {
      return res.status(400).json({ message: "Server could not create assignment because there are missing data from client at " + error.column});
    }

    return res.status(500).json({ "message": "Server could not create assignment because database connection" });
  }

})

app.get("/assignments", async (req, res) => {
  //1 access body and req

  //2 sql statments
  try {
  const result = await connectionPool.query(`SELECT * FROM assignments`);
  //3 res section
  return res.status(200).json({
    "data": result.rows
  });
  } catch (error) {
    return res.status(500).json({
      "message": "Server could not read assignment because database connection"
    });
  }
})

app.get("/assignments/:assignmentId", async (req, res) => {
  //1 access body and req
  const assignmentIdFromClient = req.params.assignmentId;
  //2 sql statments
  try {
    const result = await connectionPool.query(`SELECT * FROM assignments WHERE assignment_id = $1`, [assignmentIdFromClient]);
  //3 res sections
    if (result.rowCount == 0) {
      return res.status(404).json({
        "message": "Server could not find a requested assignment"
      });
    }
    return res.status(200).json({
      "data": result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      "message": "Server could not read assignment because database connection"
    })
  }
})

app.put("/assignments/:assignmentId", async (req, res) => {
  //1 access body and req
  const assignmentIdFromClient = req.params.assignmentId;
  const updateAssignment = {
    ...req.body,
    "updated_at": new Date()
  };
  //2 sql statments
  try {
    const result = await connectionPool.query(`UPDATE assignments SET title = $2, content = $3, category = $4, updated_at = $5 WHERE assignment_id = $1`,
      [
        assignmentIdFromClient,
        updateAssignment.title,
        updateAssignment.content,
        updateAssignment.category,
        updateAssignment.updated_at
      ]
    )
    //3 res section
    if (result.rowCount == 0) {
      return res.status(404).json({
        "message": "Server could not find a requested assignment to update"
      });
    }

    return res.status(200).json({
      "message": "Updated assignment sucessfully"
    });

  } catch (error) {
    return res.status(500).json({
      "message": "Server could not update assignment because database connection"
    });
  }
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  //1 access body and req
  const assignmentIdFromClient = req.params.assignmentId;
  //2 sql statments
  try {
    const result = await connectionPool.query(`DELETE FROM assignments WHERE assignment_id = $1`, [assignmentIdFromClient]);
    //3 res section 
    //console.log(result.rowCount);
    if (result.rowCount < 1) {
      return res.status(404).json({
        "message": "Server could not find a requested assignment to delete"
      })
    }
    return res.status(200).json({
      "message": "Deleted assignment sucessfully"
    });
  } catch(error) {
    return res.status(500).json({
      "message": "Server could not delete assignment because database connection"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
