import React from 'react';
import './Form.scss';


export default class Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            plans:[],
            plan: "",
            name: "",
            seats: 5,
            cost: 10,
            price: 0
        }
        this.handlePlanChange = this.handlePlanChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    loadPlans(baseURL) {
        fetch(baseURL + "/api/plans")
        .then(response => {
          return response.json();
        }).then(json =>{
           this.setState({
               plans: json
           });
           console.log('loadplans json', this.state.plans);
        }).catch(err => {
          console.log(err);
        })
    }

    loadCost(plan) {
        console.log("load cost plan: " + plan);
        fetch("http://localhost:9000/api/cost/" + plan)
        .then(response => {
          return response.json();
        }).then(json =>{
            console.log("load cost: " + json);
            this.setState({
                cost: json,
            });
            return this.state.cost;
        }).catch(err => {
          console.log(err);
        })
    }

    // //GET Current plan
    loadCurrentPlan(baseURL) {
        fetch(baseURL + "/api/current")
        .then(response => {
          return response.json();
        }).then(json =>{
          console.log("loadcurrplan json: ", json);
           let currTotal = json.cost * this.state.seats;
           let currName = json.name;
           let currPlan = json.plan;
           let planCost = json.cost;
           console.log("currtotal: " + currTotal);
           this.setState({
               name: currName,
               plan: currPlan,
               cost: planCost,
               price: currTotal
           });
           
        }).catch(err => {
          console.log(err);
        })
    }

    componentDidMount(){
        this.loadPlans(this.props.baseURL);
        this.loadCurrentPlan(this.props.baseURL);
    }

    //when the plan is changed, update the cost and price
    handlePlanChange = (e) => {
        // console.log(e.target.value);
        // console.log(this.state.seats);
        let planName = e.target.value;
        this.loadCost(planName);
        this.setState({
            plan: planName
            // price: this.state.cost * this.state.seats
        })
    }

    //when the seat is changed, update the cost and price
    handleSeatChange = (e) => {
        // let seatNum = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log("data sent: " + data);
        fetch('/api/savePlan', {
            method: 'POST',
            body: data,
        });
    }

    render(){
        return(
            //e.target.value will change to what ever the usr typed
            <form onSubmit={this.handleSubmit}>
                <div className="plan-field">
                    <label>Plan</label>
                    <select name="plan" value={this.state.plan} onChange={this.handlePlanChange} >
                        {this.state.plans.map((planItem) => (
                            <option key={planItem.plan} value={planItem.plan}>{planItem.name}</option>
                        ))}
                    </select>
                </div>
                <p className="cost">{this.state.cost}</p>
                <div className="seats-field">
                    <label>Seats</label>
                    <input type="text" value={this.state.seats} onChange={this.handleSeatChange} />
                </div>
                <div className="price-field">
                    <label>Price</label>
                    <p>${this.state.price}</p>
                </div>
                <button className="sub-btn">Update Subscription</button>
            </form>
        )
    }

}