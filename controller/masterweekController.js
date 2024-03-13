const getmasterweeks = async (req, res) => {
  req.mysql.query("SELECT * FROM masterweek", (error, results, fields) => {
    if (error) {
      res.status(400).json({ error: "Error retrieving masterweek" });
      return;
    }
    res.json(results);
  });
};

const addMasterWeek = async (req, res) => {
  try {
    const visits = JSON.stringify(req.body.visits);

    const fromdate = JSON.stringify(req.body.from_date);
    const todate = JSON.stringify(req.body.to_date);

    const query = `INSERT INTO masterweek (from_date, to_date, visits) VALUES (${fromdate},${todate}, ${visits})`;

    req.mysql.query(query, (err, result) => {
      if (err) {
        res.status(400).send("Error adding masterweek" + err);
      } else {
        res.status(200).send("Masterweek Added Successfully");
      }
    });
  } catch (error) {
    res.status(400).send("Error adding Masterweek");
  }
};

const getmasterweeksById = async (req, res) => {
  const id = JSON.stringify(req.body.id);

  req.mysql.query(
    `SELECT * FROM masterweek WHERE id = ${id}`,
    (error, results, fields) => {
      if (error) {
        console.error("Error retrieving masterweek:", error);
        res.status(400).json({ error: "Error retrieving masterweek" });
        return;
      }
      res.json(results);
    }
  );
};

const getmasterweeksByMemberId = async (req, res) => {
  const id = (req.body.id);

  req.mysql.query(
    `SELECT * FROM masterweek WHERE member_id = ${id}`,
    (error, results, fields) => {
      if (error) {
        console.error("Error retrieving masterweek:", error);
        res.status(400).json({ error: "Error retrieving masterweek" });
        return;
      }
      res.json(results);
    }
  );
};

const deleteMasterWeekById = async (req, res) => {
  const id = req.body.id;

  req.mysql.query(
    `DELETE FROM masterweek WHERE id = ${id}`,
    (error, results, fields) => {
      if (error) {
        res.status(400).json({ error: "Error deleting master week" });
        return;
      }
      res.json({ message: "Master week deleted successfully" });
    }
  );
};

const updateMasterWeekById = async (req, res) => {
  try {
    const id = req.body.id;
    const visits = req.body.visits;

    const query = `UPDATE masterweek SET visits = '${visits}' WHERE id = ${id};`;

    req.mysql.query(query, (err, result) => {
      if (err) {
        res.status(400).send("Error updating masterweek");
      } else {
        res.status(200).send("masterweek updated successfully");
      }
    });
  } catch (error) {
    res.status(400).send("Error updating masterweek");
  }
};

module.exports = {
  getmasterweeksById,
  getmasterweeks,
  deleteMasterWeekById,
  updateMasterWeekById,
  addMasterWeek,
  getmasterweeksByMemberId
};
