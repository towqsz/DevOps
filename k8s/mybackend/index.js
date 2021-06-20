const express = require('express');
const cors = require('cors');
var uuid = require('uuid-random');
const bodyParser = require("body-parser");
const redisPORT = process.env.RD_PORT
const pgPORT = process.env.PG_PORT

const app = express();

app.use(cors());
app.use(express.json());

const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: redisPORT,
    //retry_strategy: () => 1000
}); 

redisClient.on('connect', () => {
    console.log("Connected to redis server.")
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.PG_PORT
});

pgClient.on('error', () => {
    console.log("Postgress not connected");
});
pgClient.on('connect', () => {
    console.log("Postgress connected");
});
pgClient
//.query('DROP TABLE phones')
.query('CREATE TABLE IF NOT EXISTS phones (id VARCHAR(255), owner VARCHAR(255), brand VARCHAR(255), model VARCHAR(255), number INT)')
.catch((err) => {
    console.log(err);
});

//pgClient
//.query('INSERT INTO phones (id, owner, brand, model, number) VALUES ($1, $2, $3, $4, $5)', ["1", "owner", "brand", "model", 111111111])
//.catch((err) => {
//        console.log(err);
//});
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello Phones!")
});


const PORT = 4000;
app.listen(PORT, ()=> {
    console.log(`Api listetning on port ${PORT}`);
});

app.get('/phones/:owner', (req, res) => {
    try {
      const phoneOwner = req.params.owner;
    
      // Check the redis store for the data first
      redisClient.get(phoneOwner, async (err, phone) => {
        if (phone) {
          return res.status(200).json( JSON.parse(phone))
        } else { // When the data is not found in the cache then we can make request to the server
            console.log(`${phoneOwner} not found in redis`)
            pgClient.query('SELECT * FROM phones WHERE owner = $1', [phoneOwner], (error, results) => {
                if (error) {
                  throw error
                }
                redisClient.setex(phoneOwner, 1440, JSON.stringify(results.rows));
                res.status(200).json(results.rows)
              })
    
        }
      }) 
    } catch (error) {
        console.log(error)
    }
   });

   app.get('/getall', (req, res) => {
    try {
    
      // Check the redis store for the data first
      
        // When the data is not found in the cache then we can make request to the server
            console.log(` not found in redis`)
            pgClient.query('SELECT * FROM phones', (error, results) => {
                if (error) {
                  throw error
                }
                res.status(200).json(results.rows)
              })
    
        
    } catch (error) {
        console.log(error)
    }
   });

   app.post('/phones', (request, response) => {
    try {
        console.log(request.body)
        const {owner, brand, model, number} = request.body
        const id = uuid();
      
        pgClient.query('INSERT INTO phones (id, owner, brand, model, number) VALUES ($1, $2, $3, $4, $5)', [id, owner, brand, model, number], (error, results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`Phone added with ID: ${id}`)
        })
    } catch (error) {
        console.log(error)
    }
   });

   app.post('/delete', (request, response) => {
    try {
        console.log(request.body)
        const {id} = request.body
      
        pgClient.query('DELETE FROM phones WHERE id = ($1)', [id], (error, results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`Phone added with ID: ${id}`)
        })
    } catch (error) {
        console.log(error)
    }
   });

   app.post('/update', (request, response) => {
    try {
        console.log(request.body)
        const {id, owner, brand, model, number} = request.body
      
        pgClient.query('UPDATE phones SET owner = ($1), brand = ($2), model = ($3), number = ($4) WHERE id = ($5);', [owner, brand, model, number, id], (error, results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`Phone added with ID: ${id}`)
        })
    } catch (error) {
        console.log(error)
    }
   });

   app.post('/cleardb', (request, response) => {
    try {
        console.log(request.body)
        const {id} = request.body
      
        pgClient.query('DELETE * FROM phones', (error, results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`Phone added with ID: ${id}`)
        })
    } catch (error) {
        console.log(error)
    }
   });

   const getByOwner = (request, response) => {
    const owner = parseInt(request.params.owner)
  
    pgClient.query('SELECT * FROM phones', (error, results) => {
      if (error) {
        throw error
      }
      //response.status(200).json(results.rows)
      return results.rows
    })
  }

  const createPhone = (request, response) => {
    const {owner, brand, model, number} = request.body
    const id = uuid();
  
    pgClient.query('INSERT INTO phones (id, owner, brand, model, number) VALUES ($1, $2, $3, $4, $5)', [id, owner, brand, model, number], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Phone added with ID: ${results.insertId}`)
    })
  }