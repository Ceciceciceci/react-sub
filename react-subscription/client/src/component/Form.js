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
            price: 0,
            submitted: false
        }
        this.handlePlanChange = this.handlePlanChange.bind(this);
        this.handleSeatChange = this.handleSeatChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.backToForm = this.backToForm.bind(this);
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
            // console.log("load cost: " + json);
            this.setState({
                cost: json,
            }, () => {
                this.setState({price: this.state.cost * this.state.seats});
            });
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
        //   console.log("loadcurrplan json: ", json);
           let currTotal = json.cost * this.state.seats;
           let currName = json.name;
           let currPlan = json.plan;
           let planCost = json.cost;
        //    console.log("currtotal: " + currTotal);
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
        let planName = e.target.value;
        this.loadCost(planName);
        this.setState({
            plan: planName,
            name: planName.charAt(0).toUpperCase() + planName.slice(1)
        })
    }

    //when the seat is changed, update the cost and price
    handleSeatChange = (e) => {
        // console.log("num of seats: " + e.target.value);
        let seatNum = e.target.value;
        let currCost = this.state.cost;
        this.setState({
            [e.target.name]: e.target.value,
            price: seatNum * currCost,
        })
    }

    //PUT req to /api/current to update the current
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        this.setState({
            submitted: true
        })
        const data = new FormData(e.target);
        // for (var value of data.values()) {
        //     console.log(value); 
        //  }
        fetch('http://localhost:9000/api/preview', {
            method: 'PUT',
            body: this.state
        }).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    backToForm = (e) =>{
        this.setState({
            submitted: false
        })
    }

    render(){
        const { plan, seats, cost, price, submitted } = this.state;

        console.log("submitted?: " + submitted);
        //e.target.value will change to what ever the usr typed
        return(
            <section>
                { submitted ? (
                    <section className="preview-page">
                        <div className="previous">
                            <h4>Previous Subscription</h4>
                            <table>
                                <tr>
                                    <td className="category">Plan</td>
                                    <td>{plan}</td>
                                </tr>
                                <tr>
                                    <td className="category">Seats</td>
                                    <td>{seats}</td>
                                </tr>
                                <tr>
                                    <td className="category">Total</td>
                                    <td>${price}</td>
                                </tr>
                            </table>
                        </div>
            
                        <div className="new">
                            <h4>Updated Subscription</h4>
                            <table>
                                <tr>
                                    <td className="category">Plan</td>
                                    <td>{plan.charAt(0).toUpperCase() + plan.slice(1)}</td>
                                </tr>
                                <tr>
                                    <td className="category">Seats</td>
                                    <td>{seats}</td>
                                </tr>
                                <tr>
                                    <td className="category">Total</td>
                                    <td>${price}</td>
                                </tr>
                            </table>
                        </div>
                        <button className="back" onClick={this.backToForm}>Back</button>
                    </section>
                ) : (
                    <section className="sub-form">
                        <h2>Select or Update Subscription</h2>
                        <div className="line"></div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="plan-field">
                                <label>Plan</label>
                                <select name="plan" value={plan} onChange={this.handlePlanChange} >
                                    {this.state.plans.map((planItem) => (
                                        <option key={planItem.plan} value={planItem.plan}>{planItem.name}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="cost">{cost}</p>
                            <div className="seats-field">
                                <label>Seats</label>
                                <input type="text" name="seats" value={seats} onChange={e => this.handleSeatChange(e)} />
                            </div>
                            <div className="price-field">
                                <label>Total Price</label>
                                <input name="price" value={price} disabled/>
                            </div>
                            <button type="submit" className="sub-btn" disabled={!seats}>Update</button>
                        </form>
                    </section>
                )}
            </section>
        ); //end of return
    }
}