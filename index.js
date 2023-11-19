
const express = require('express')
const con = require("./config");
const app = express()
const bcrypt = require('bcrypt');
const { request, response } = require('express');
const jwt = require("jsonwebtoken");
const { data } = require('jquery');

app.use(express.json());

const authenticateToken = async (req, res, next) => {
  let jwtToken;
  const authHeader = await req.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1]
  }
  if (jwtToken == undefined) {
    res.status(401)
    res.send("Invalid Access Token")
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", (error, payload) => {
      if (error) {
        res.status(401)
        res.send("Invalid Access Token");
      } else {
        req.user_name = payload.username;
        next()
      }
    });

  }
}

app.post('/daily_use', async (req, res) => {
  const data = [req.body.name, req.body.img, req.body.p_id, req.body.product_id]
  con.query('INSERT INTO daily_use SET name = ?, img = ?, p_id = ?, product_id = ?', await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })

});

app.get('/daily_use', (req, res) => {
  con.query("select * from daily_use", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});


app.post('/carousel', async (req, res) => {
  const data = [req.body.name, req.body.img, req.body.p_id, req.body.product_id, req.body.s_id]
  con.query('INSERT INTO carousel SET name = ?, img = ?, p_id = ?, product_id = ?, s_id = ?', await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })

});



app.get('/carousel', (req, res) => {
  con.query("select * from carousel", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.post('/carousel', async (req, res) => {
  const data = [req.body.name, req.body.img, req.body.p_id, req.body.product_id, req.body.s_id]
  con.query('INSERT INTO carousel SET name = ?, img = ?, p_id = ?, product_id = ?, s_id = ?', await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })

});

app.delete("/carousel/:id", (req, res) => {
  con.query("DELETE FROM carousel WHERE id =" + req.params.id, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});


app.get('/card', (req, res) => {
  con.query("select * from card", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.post('/card', async (req, res) => {
  const data = [req.body.name, req.body.img, req.body.p_id, req.body.product_id, req.body.s_id, req.body.details,]
  con.query('INSERT INTO card SET name = ?, img = ?, p_id = ?, product_id = ?, s_id = ?, details = ?', await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })

});



app.delete("/card", (req, res) => {
  con.query("DELETE FROM card", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  });

});

app.delete("/card/:id", (req, res) => {
  con.query("DELETE FROM card WHERE id =" + req.params.id, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.get('/profile', authenticateToken, async (req, res) => {
  let { user_name } = req
  console.log(user_name)
  const data = user_name
  con.query("select * from users WHERE user_name =?", await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })


});


app.get('/users', (req, res) => {
  con.query("select * from users", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});



app.get('/users/:id', authenticateToken, async (req, res) => {
  const data = req.params.id
  con.query("select * from users WHERE id =?", await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.post('/singin', async (req, res) => {
  const data = [req.body.name, req.body.phone_number, req.body.address, req.body.user_name, req.body.password]
  con.query('INSERT INTO users SET name = ?, phone_number = ?, address = ?, password = ?, user_name = ? ', await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })

});



app.post('/login', async (req, res) => {
  const data = [req.body.user_name, req.body.password]
  con.query(`select * from users WHERE user_name =? and password =?`, await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      const lenght = result.length
      if (lenght == "0") {
        res.send("Invalid User")
      }
      else {
        const payload = {
          username: req.body.user_name
        };
        const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
        res.send({ jwtToken });
      }
    }
  })

});




app.put("/users/:id", authenticateToken, async (req, res) => {
  const data = [req.body.name, req.body.phone_number, req.body.address, req.body.password, req.body.user_name, req.params.id];
  con.query("UPDATE users SET name = ?, phone_number = ?, address = ?, password = ?, user_name = ?  WHERE id = ?", await data, (error, result, fields) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
})




app.delete("/users/:id", (req, res) => {
  con.query("DELETE FROM users WHERE id =" + req.params.id, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })

});

app.delete("users/all", (req, res) => {
  con.query("DELETE FROM users", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  });

});

// category 

app.post('/category', async (req, res) => {
  const data = [req.body.name, req.body.img]
  con.query('INSERT INTO category SET name = ?, img = ?', await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })

});

app.get('/category', (req, res) => {
  con.query("select * from category", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.put("/category/:id", authenticateToken, async (req, res) => {
  const data = [req.body.name, req.body.img, req.params.id];
  con.query("UPDATE category SET name = ?, img = ? WHERE id = ?", await data, (error, result, fields) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
})

app.get('/category/:id', authenticateToken, async (req, res) => {
  const data = req.params.id
  con.query("select * from category WHERE id =?", await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});


app.delete("/category/:id", (req, res) => {
  con.query("DELETE FROM category WHERE id =" + req.params.id, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.delete("/category/all", (req, res) => {
  con.query("DELETE FROM category WHERE id =" + req.params.id, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

//product

app.post('/product', async (req, res) => {
  const data = [req.body.name,req.body.img, req.body.description, req.body.category_id, req.body.price, req.body.best_offer, req.body.measurement, req.body.p_id]
  con.query('INSERT INTO products SET name = ?, img = ?, description = ?, category_id = ?, price = ?, best_offer = ?, measurement = ?, p_id = ?', await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })

});



app.put("/product/:id", async (req, res) => {
  const data = [req.body.name,req.body.img, req.body.description, req.body.category_id, req.body.price, req.body.best_offer, req.body.measurement, req.body.relative_product, req.body.category_name, req.params.id];
  con.query("UPDATE products SET  name = ?, img = ?, description = ?, category_id = ?, price = ?, best_offer = ?, measurement = ?, relative_product = ?, category_name = ?  WHERE id = ?", await data, (error, result, fields) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
})

app.put("/product/ll", authenticateToken, async (req, res) => {
  const data = [req.body.relative_product, req.body.category_name,  req.body.name];
  con.query("UPDATE * products SET relative_product = ?, category_name = ?,  WHERE name ?", await data, (error, result, fields) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
})

app.put("/product/", async (req, res) => {
  const data = [req.body.price, req.body.measurement, `%${req.body.name}%`];
  con.query("UPDATE products SET  price = ?, measurement = ?  WHERE name LIKE ?", await data, (error, result, fields) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
})


app.get('/product', (req, res) => {
  con.query("select * from products", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.get('/product/name',async (req, res) => {
  const data = [`%${req.body.name}%`]
  console.log(data)
  con.query(`select * from products WHERE name LIKE ?`,await data,  (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.get('/product/:id', async (req, res) => {
  const data = req.params.id
  con.query("select * from products WHERE id =?", await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.get('/product/category', authenticateToken,async (req, res) => {
  const data = [`%${req.body.category_name}%`]
  console.log(data)
  con.query(`select * from products WHERE category_name LIKE ?`,await data,  (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});


app.get('/product/category/:id', authenticateToken, async (req, res) => {
  const data = req.params.id
  con.query("select * from products WHERE category_id =?", await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});

app.get('/product/product/:id', authenticateToken, async (req, res) => {
  const data = req.params.id
  con.query("select * from products WHERE relative_product =?", await data, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});



app.delete("/product/:id", (req, res) => {
  con.query("DELETE FROM products WHERE id =" + req.params.id, (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  })
});



app.delete("product/all", (req, res) => {
  con.query("DELETE FROM products", (error, result) => {
    if (error) {
      res.send(error)
    }
    else {
      res.send(result)
    }
  });
});


app.listen(4000)