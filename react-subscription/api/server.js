
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

app.get("/api/plans", (req, res) => {
    res.json(plans);
});

app.get("/api/current", (req, res) => { 
    res.json(currPlan);
});

app.get("/api/previous", (req, res) => {
    res.json(prevPlan);
});

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
    res.status(404).send('Plan cost Not Found');
});

app.put('/api/current', (req, res, next) => {
    console.log(req.body);
    res.send("response");
    // let planJson = req.body;
    
    // res.send(req.body.plan);
    // let newPlan = {
    //     plan:  req.body.plan,
    //     name:  req.body.name,
    //     seats: req.body.seats,
    //     cost:  req.body.cost      
    // }
    // prevPlan = currPlan;
    // currPlan = newPlan;

    // res.json(newPlan);
    // // sending 404 when not found 
    // // res.status(400).send("Form is missing something");
    // res.send('Subscription is updated');
});

const port = 9000;
app.listen(port, () => console.log(`Server started on port ${port}`));