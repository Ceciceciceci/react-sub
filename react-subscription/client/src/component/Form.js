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
            submitted: false,
            disableBtn: true,
            //for previous
            pName: "",
            pPlan: "",
            pSeats: "",
            pCost: 0,
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
                this.setState({price: this.state.cost * this.state.seats, disableBtn: false});
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
           let currTotal = json.cost * this.state.seats;
           let currName = json.name;
           let currPlan = json.plan;
           let planCost = json.cost;
           this.setState({
               name: currName,
               plan: currPlan,
               cost: planCost,
               price: currTotal,
           });
           
        }).catch(err => {
          console.log(err);
        })
    }

    loadPreviousPlan() {
        fetch("http://localhost:9000/api/previous")
        .then(response => {
          return response.json();
        }).then(json =>{
           let prevTotal = json.cost * json.seats;
           let prevName = json.name;
           let prevPlan = json.plan;
           let prevCost = json.cost;
           let prevSeats = json.seats;
           this.setState({
               pName: prevName,
               pPlan: prevPlan.charAt(0).toUpperCase() + prevPlan.slice(1),
               pCost: prevCost,
               pSeats: prevSeats,
               pPrice: prevTotal,
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
        let seatNum = e.target.value;
        // if (seatNum !== Number(seatNum)) {
        //     this.setState({
        //         [e.target.name]: e.target.value,
        //         price: "Enter valid number"
        //     })
        // }
        let currCost = this.state.cost;
        this.setState({
            [e.target.name]: e.target.value,
            price: seatNum * currCost,
            disableBtn: false
        })
    }

    //PUT req to /api/current to update the current
    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(JSON.stringify(this.state));
        this.loadPreviousPlan();
        this.setState({
            submitted: true
        })
        const data = new FormData(e.target);
        fetch('http://localhost:9000/api/current', {
            method: 'PUT',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.parse(JSON.stringify(this.state).replace(/\\n\\t/g, ''))
        }).then(response => {
            return response;
        }).then(json => {
            console.log("json: ");
            console.log("- - - - - - -");
            console.log(json);
            console.log("- - - - - - -");
        }).catch(error => {
            console.log(error);
        });
    }

    backToForm = (e) =>{
        this.setState({
            submitted: false,
            disableBtn: true
        })
    }

    render(){
        const { plan, seats, cost, price, submitted, disableBtn, pPlan, pSeats, pPrice } = this.state;

        console.log("submitted?: " + submitted);
        //e.target.value will change to what ever the usr typed
        return(
            <section>
                { submitted ? (
                    <section className="preview-page">
                        <div className="previous">
                            <h4>Previous Subscription</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="category">Plan</td>
                                        <td>{pPlan}</td>
                                    </tr>
                                    <tr>
                                        <td className="category">Seats</td>
                                        <td>{pSeats}</td>
                                    </tr>
                                    <tr>
                                        <td className="category">Total</td>
                                        <td>${pPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
            
                        <div className="new">
                            <h4>Updated Subscription</h4>
                            <table>
                                <tbody>
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
                                </tbody>
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
                            <input className="cost" value={cost} />
                            <div className="seats-field">
                                <label>Seats</label>
                                <input type="text" name="seats" value={seats} onChange={e => this.handleSeatChange(e)} />
                            </div>
                            <div className="price-field">
                                <label>Total Price (USD $)</label>
                                <input name="price" value={price} disabled/>
                            </div>
                            <button type="submit" className="sub-btn" disabled={!seats || disableBtn}>Update</button>
                        </form>
                    </section>
                )}
            </section>
        ); //end of return
    }
}