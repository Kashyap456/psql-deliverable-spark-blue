const express = require("express");
const cors = require("cors");
const pg = require("pg");
const app = express();
app.use(express.json());
app.use(cors());

const pickTicket = async () => {
  const client = new pg.Client({
    //if you want the following to work on your own computer
    //replace the fields with your information

    user: "kashyapc",
    database: "blue_deliv",
    password: "",
    port: 5432,
  });

  await client.connect();

  const tableName = "lottery";
  const queryText = `SELECT * FROM ${tableName};`;

  const res = await client.query(queryText);
  await client.query("DELETE FROM lottery;");
  console.log(res);
  if (res.rowCount > 0) {
    const { rows } = res;
    const row = rows[(rows.length * Math.random()) | 0];
    return row.username;
  }

  //close connection
  await client.end();

  return "<ERROR>";
};

const buyTicket = async (user) => {
  const client = new pg.Client({
    //if you want the following to work on your own computer
    //replace the fields with your information

    user: "kashyapc",
    database: "blue_deliv",
    password: "",
    port: 5432,
  });

  await client.connect();

  const tableName = "lottery";
  const queryText = `INSERT INTO ${tableName} (username) VALUES ($1)`;
  const values = [user];
  const res = await client.query(queryText, values);
  console.log(res);

  //close connection
  await client.end();

  return res;
};

const createUser = async (user) => {
  const client = new pg.Client({
    //if you want the following to work on your own computer
    //replace the fields with your information

    user: "kashyapc",
    database: "blue_deliv",
    password: "",
    port: 5432,
  });

  await client.connect();

  const tableName = "users";
  const queryText = `INSERT INTO ${tableName} (username) VALUES ($1) ON CONFLICT (username) DO NOTHING;`;
  const values = [user];
  const res = await client.query(queryText, values);
  console.log(res);

  //close connection
  await client.end();

  return user;
};

app.post("/login", async (req, res) => {
  console.log(req);
  const { user } = req.body;
  const useres = await createUser(user);
  console.log(useres);
  res.status(200).send(user);
});

app.post("/buy", async (req, res) => {
  const { user } = req.body;
  const ticket = await buyTicket(user);
  res.status(200).send("bought");
});

app.get("/pick", async (req, res) => {
  const ticket = await pickTicket();
  if (ticket === "<ERROR>") {
    res.status(200).send("<ERROR>");
  } else {
    res.send(ticket);
  }
});

const port = 3256;
const host = "localhost";
app.listen(port, host, () => {
  console.log(`Example app listening on port ${port}`);
});

/*
To run -->  node index.js
node is the javascript runtime environment that runs our code in the file 'index.js'
*/
