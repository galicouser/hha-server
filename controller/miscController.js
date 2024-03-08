const getmisc = async (req, res) => {
    req.mysql.query("SELECT * FROM misc", (error, results, fields) => {
       
        if (error) {
          res.status(400).json({ error: "Error retrieving visits" });
          return;
        }
        res.json(results);
      });
  };
    
  module.exports = {
    getmisc,
  };