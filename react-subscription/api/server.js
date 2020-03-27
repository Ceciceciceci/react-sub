
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

const plans = [
    { "plan": "basic", "name": "Basic", "cost": 1 },
    { "plan": "good", "name": "Good", "cost": 10 },
    { "plan": "better", "name": "Better", "cost": 100 },
    { "plan": "best", "name": "Best", "cost": 1000}
  ];

let currPlan = {
    "plan": 'good',
    "name": 'Good',
    "seats": 5,
    "cost": 10
};

let prevPlan = {
    "plan": 'good',
    "name": 'Good',
    "seats": 5,
    "cost": 10
};

//get all plan data 
app.get("/api/plans", (req, res) => {
    res.json(plans);
});

//grab the current plan
app.get("/api/current", (req, res) => { 
    res.json(currPlan);
});

//grab the previous plan
app.get("/api/previous", (req, res) => {
    res.json(prevPlan);
});

//get the cost of each plan
app.get('/api/cost/:plan', (req, res) => {
    // reading plan name from the URL
    const selPlan = req.params.plan;

    // searching costs for the plan
    for (let checkplan of plans) {
        if (checkplan.plan === selPlan) {
            res.json(checkplan.cost);
            return;
        }
    }
    // sending 404 when not found
    // res.status(404).send('Plan cost Not Found');
});

//PUT request to current to save subscription and replace the prev with the last current plan
app.put('/api/current', (req, res, next) => {
    const newPlan = {
        plan:  req.body.plan,
        name:  req.body.name,
        seats: req.body.seats,
        cost:  req.body.cost      
    }
    prevPlan = currPlan;
    currPlan = newPlan;

    res.json(newPlan);
    // sending 404 when not subscription new could not be saved
    // res.status(404).send('Plan could not be saved');
});

const port = 9000;
app.listen(port, () => console.log(`Server started on port ${port}`));