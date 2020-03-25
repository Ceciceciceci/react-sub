
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const plans = [
    { "plan": "basic", "name": "Basic", "cost": 1 },
    { "plan": "good", "name": "Good", "cost": 10 },
    { "plan": "better", "name": "Better", "cost": 100 },
    { "plan": "best", "name": "Best", "cost": 1000}
  ];

app.get("/api/plans", (req, res) => {
    res.json(plans);
});

app.get("/api/current", (req, res) => {
    const currPlan = {
            "plan": 'good',
            "name": 'Good',
            "seats": 5,
            "cost": 10
        };
  
    res.json(currPlan);
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

    // sending 404 when not found something is a good practice
    res.status(404).send('Plan cost Not Found');
});

app.get("/api/previous", (req, res) => {
    const prevPlan = {
            "plan": 'good',
            "name": 'Good',
            "seats": 5,
            "cost": 10
        };
  
    // res.json(currPlan);
});

const port = 9000;
app.listen(port, () => console.log(`Server started on port ${port}`));