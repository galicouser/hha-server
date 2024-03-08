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

const updatevisits = async (req, res) => {
  try {
    const id = req.body.id;
    const new_meta_value = req.body.meta_value;

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
};
