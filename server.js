//add express & initialize the app
const express = require("express");
const { restoreDefaultPrompts } = require("inquirer");
const app = express();
const cors = require('cors');

//add sequelize config and Task table data model
const config = require('./config/config');
const Task = require('./models/Task');

app.use(cors());
//body parser middleware for parsing incoming urlencoded payloads
app.use(express.urlencoded({ extended: false }));

//Establish connetion to database with creds from config.js
config.authenticate().then(function () {
     console.log('Database is authenticated & connected');
}).catch(function (err) {
     console.log(err);
});

//send a message to the web root to ensure connectivity
// app.get("/", (req, res) => {
//      res.json({ message: "Welcome to Task_Manager application backend." });
// });

//get all tasks using 127.0.0.1:8080/all
app.get('/all', function (req, res) {
     //use this structure to filter with the WHERE condition inserting data into findAll
     // let data = {
     //      where: {}
     // };

     Task.findAll() //use of findAll will return all records in the data(based on where condition)
          .then(function (result) {
               res.status(200).send(result);
          })
          .catch(function (err) {
               res.status(500).send({
                    message:
                         err.message || "Some error occurred while retrieving the tasks"
               });
          });
});

//get a task by task id using 127.0.0.1:8080/x, where x is the id number
app.get('/:id', function (req, res) {
     let id = req.params.id;
     if (id) {
          Task.findByPk(id)
               .then(function (result) {
                    res.status(200).send(result);
               })
               .catch(function (err) {
                    res.status(500).send({
                         message:
                              err.message || "Some error occurred while retrieving the task by id"
                    });
               });
     }
});

//Create a new task using post
app.post('/', function (req, res) {
     Task.create(req.body)
          .then(function (result) {
               res.redirect('/all'); //Redirect to the get route to display all students
          })
          .catch(function (err) {
               res.status(500).send({
                    message:
                         err.message || "Some error occurred while creating the task"
               });
          });
});

//Update either progress or priority of a task - or both by id
app.patch('/:id', function (req, res) {
     let id = req.params.id;

     //Find the task 
     Task.findByPk(id)
          .then(function (result) {
               //Check if task was found
               if (result) {

                    //Update task record for either or both progress, priority
                    //update the progress_level
                    if (req.body.progress_level !== undefined) {
                         result.progress_level = req.body.progress_level;
                    };
                    //update the priority_lelve
                    if (req.body.priority_level !== undefined) {
                         result.priority_level = req.body.priority_level;
                    };

                    //Save changes to DB
                    result.save()
                         .then(function () {
                          res.send(result);
                         })
               .catch(function (err) {
                    res.status(500).send({
                    message:
                         err.message || "Some error occurred while updating the task"
                    });
               });
          }
     });
});


//Delete a task record by id
app.delete('/:id', function (req, res) {
     let id = req.params.id;

     //Find the student
     Task.findByPk(id)
          .then(function (result) {
               if (result) {
                    //Delete task from database
                    result.destroy().then(function () {
                         res.redirect('/all');
                    }).catch(function (err) {
                         res.status(500).send(err);
                    });
               } else {
                    res.status(404).send("Task record not found");
               }
          })
          .catch(function (err) {
               res.status(500).send(err);
          });
});


// set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
     console.log(`Server is running on port ${PORT}. Use /all & /:id for selection & CRUD manipulation`)
});