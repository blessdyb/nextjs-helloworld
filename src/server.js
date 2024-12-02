// server.js
const express = require("express");
const next = require("next");
const mysql = require("mysql2");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Add your Express.js API routes here
  server.get("/nextjs-helloworld-2/api/data-test-3", (req, res) => {
    const db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    db.connect((err) => {
      if (err) {
        console.error("Database connection failed:", err.stack);
        return res.json({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
        });
      }
      console.log("Connected to MySQL database.");

      const query = "SELECT country, code_section FROM data";
      db.query(query, (err, results) => {
        if (err) {
          console.error("Error executing query:", err.stack);
          return res.status(500).send("Error executing query");
        }
        res.json(results);
      });
    });
  });

  // Let Next.js handle all other routes
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
