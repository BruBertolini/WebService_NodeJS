import express from "express";
import bodyParser from "body-parser";
import sl_db from "./db/storage_locker_db";
import users_db from "./db/users_db";

// Set up the express app
const app = express();
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//-----------------------------------------------------------users
app.get("/api/v1/users", (req, res) => {
  res.status(200).send({
    success: "true",
    message: "users retrieved successfully",
    users: users_db
  });
});

app.post("/api/v1/users", (req, res) => {
  if (!req.body.username) {
    return res.status(400).send({
      success: "false",
      message: "username is required"
    });
  } else if (!req.body.password) {
    return res.status(400).send({
      success: "false",
      message: "password is required"
    });
  }
  const user = {
    id: users_db[users_db.length - 1].id + 1,
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    cpfCnpj: req.body.cpfCnpj
  };
  users_db.push(user);
  return res.status(201).send({
    success: "true",
    message: "user added successfully",
    user
  });
});

//-------------------------------------------------login
app.post("/api/v1/login", (req, res) => {
  users_db.map(users => {
    if (users.username === req.body.username) {
      if (users.password === req.body.password) {
        return res.status(201).send({
          success: "true",
          message: "logged in successfully",
          users
        });
      } else {
        return res.status(404).send({
          success: "false",
          message: "Password incorrect"
        });
      }
    }
  });

  return res.status(404).send({
    success: "false",
    message: "User invalid"
  });
});

//---------------------------------------- storage locker
app.get("/api/v1/storageLocker", (req, res) => {
    
  res.status(200).send({
    success: "true",
    message: "storage lockers retrieved successfully",
    storage_lockers: sl_db
  });
});

app.post("/api/v1/storageLocker", (req, res) => {
  if (!req.body.address) {
    return res.status(400).send({
      success: "false",
      message: "address is required"
    });
  } else if (!req.body.capacity) {
    return res.status(400).send({
      success: "false",
      message: "capacity is required"
    });
  } else if (!req.body.openingHour) {
    return res.status(400).send({
      success: "false",
      message: "opening hour is required"
    });
  } else if (!req.body.closingHour) {
    return res.status(400).send({
      success: "false",
      message: "closing hour is required"
    });
  }
  
  const sl = {
      
    id: sl_db[sl_db.length - 1].id + 1,
    address: req.body.address,
    capacity: req.body.capacity,
    name: req.body.name,
    openingHour: req.body.openingHour,
    closingHour: req.body.closingHour
  };
  sl_db.push(sl);
  return res.status(201).send({
    success: "true",
    message: "storage locker added successfully",
    sl
  });
});

app.get("/api/v1/storageLocker/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  sl_db.map(sl => {
    if (sl.id === id) {
      return res.status(200).send({
        success: "true",
        message: "storage locker retrieved successfully",
        sl
      });
    }
  });
  return res.status(404).send({
    success: "false",
    message: "storage locker does not exist"
  });
});

app.delete("/api/v1/storageLocker/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  sl_db.map((sl, index) => {
    if (sl.id === id) {
      sl_db.splice(index, 1);
      return res.status(200).send({
        success: "true",
        message: "Storage locker deleted successfuly"
      });
    }
  });

  return res.status(404).send({
    success: "false",
    message: "Storage locker not found"
  });
});

app.put("/api/v1/storageLocker/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  let slFound;
  let itemIndex;
  sl_db.map((sl, index) => {
    if (sl.id === id) {
      slFound = sl;
      itemIndex = index;
    }
  });

  if (!slFound) {
    return res.status(404).send({
      success: "false",
      message: "storage locker not found"
    });
  }

  if (!req.body.address) {
    return res.status(400).send({
      success: "false",
      message: "address is required"
    });
  } else if (!req.body.capacity) {
    return res.status(400).send({
      success: "false",
      message: "capacity is required"
    });
  } else if (!req.body.openingHour) {
    return res.status(400).send({
      success: "false",
      message: "opening hour is required"
    });
  } else if (!req.body.closingHour) {
    return res.status(400).send({
      success: "false",
      message: "closing hour is required"
    });
  }
  

  const updatedSL = {
    id: slFound.id,

    address: req.body.address || slFound.address,
    capacity: req.body.capacity || slFound.capacity,
    name: req.body.name || slFound.name,
    openingHour: req.body.openingHour || slFound.openingHour,
    closingHour: req.body.closingHour || slFound.closingHour
  };

  sl_db.splice(itemIndex, 1, updatedSL);

  return res.status(201).send({
    success: "true",
    message: "storage locker added successfully",
    updatedSL
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
