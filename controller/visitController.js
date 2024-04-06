const postvisit = async (req, res) => {
  try {
    const jsonString = JSON.stringify(req.body);

    const query = `INSERT INTO visits (meta_key, meta_value, status, endpoint, datetime) VALUES ('postvisit','${jsonString}', 1, '', CURRENT_TIMESTAMP)`;

    req.mysql.query(query, (err, result) => {
      if (err) {
        res.status(400).send("Error updating visit");
      } else {
        res.status(200).send("Visit updated successfully");
      }
    });
  } catch (error) {
    res.status(400).send("Error updating visit");
  }
};


const deleteVisitById = async (req, res) => {

  console.log("I am in del visits")
  console.log(res)

  const obj = req.body;
  const jsonStringKey = Object.keys(obj)[0];
  
  const jsonObject = JSON.parse(jsonStringKey);
  
  const id = jsonObject.id;
  
    req.mysql.query(
      `DELETE FROM visits WHERE id = ${id}`,
      (error, results, fields) => {
        if (error) {
          res.status(400).json({ error: "Error deleting master week" });
          return;
        }
        console.log('Deleted Successfully')
        res.status(200).send("Visit Deleted successfully");
      }
    );
  };

const getvisits = async (req, res) => {
  req.mysql.query("SELECT * FROM visits", (error, results, fields) => {
    console.log(results);
    if (error) {
      res.status(400).json({ error: "Error retrieving visits" });
      return;
    }
    res.json(results);
  });
};

const getVisitById = async (req, res) => {

  const id = JSON.stringify(req.query.id);

  req.mysql.query(`SELECT * FROM visits WHERE id = ${id}`, (error, results, fields) => {
    if (error) {
      console.error("Error retrieving visits:", error);
      res.status(400).json({ error: "Error retrieving visits" });
      return;
    }
    res.json(results);
  });
};

const getVisitByMemberId = async (req, res) => {


  const memberId = req.query.id; 

  req.mysql.query(
    `SELECT * FROM visits WHERE meta_value LIKE '%${memberId}%'`,
    (error, results, fields) => {
      if (error) {
        console.error("Error retrieving visits:", error);
        res.status(400).json({ error: "Error retrieving visits" });
        return;
      }
      res.json(results);
    }
  );
};


const getVisitByCaregiverID = async (req, res) => {

  const caregiverId = req.query.id; 
  console.log("Iam pinged")

  req.mysql.query(
    `SELECT * FROM visits WHERE meta_value LIKE '%${caregiverId}%'`,
    (error, results, fields) => {
      if (error) {
        console.error("Error retrieving visits:", error);
        res.status(400).json({ error: "Error retrieving visits" });
        return;
      }
      res.json(results);
    }
  );
};






const updatevisits = async (req, res) => {
  try {


    const requestBody = JSON.parse(Object.keys(req.body)[0]);

    const id = requestBody.id;
    const new_meta_value = requestBody.meta_value;

    console.log("ID RECIEVED IS")
    console.log(id)


    const query = `UPDATE visits SET meta_value = '${new_meta_value}' WHERE id = ${id};`;

    req.mysql.query(query, (err, result) => {
      if (err) {
        res.status(400).send("Error updating visit");
      } else {
        res.status(200).send("Visit updated successfully");
      }
    });
  } catch (error) {
    res.status(400).send("Error updating visit");
  }
};

module.exports = {
  postvisit,
  getvisits,
  updatevisits,
  getVisitById,
  getVisitByMemberId,
  deleteVisitById,
  getVisitByCaregiverID
};
