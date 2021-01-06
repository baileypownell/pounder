
import React from 'react'
import './Goal.scss'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
var { DateTime } = require('luxon');

class Goal extends React.Component {
    state = {
        goalWeight: '',
        goalTarget: '',
        goalToDeleteId: ''
    }

    componentDidMount() {
        var elems = document.querySelectorAll('.datepicker');
        M.Datepicker.init(elems, {
            minDate: new Date(),
            format: 'mmm dd, yyyy',
            onSelect: (e) => { this.setState({ goalTarget: e})}
        });

        // confirmation modal 
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});
    }

    handleChange = (e)  => {
        if (e.target.value > 0 || e.target.value === '') {
            this.setState({
                [e.target.id]: e.target.value
            })
        }
    }

    addGoal = () => {
        const db = firebase.firestore();
        db.collection("users").doc(this.props.localId).update({
           goals: this.props.goals.concat({
                goalWeight: this.state.goalWeight, 
                goalTarget: this.state.goalTarget,
                id: uuidv4()
            })
        })
        .then(res => {
            M.toast({ html: 'Goal added!'})
            this.setState({
                goalWeight: '', 
                goalTarget: ''
            })   
            this.props.updateGoals()
        })
        .catch(err => console.log(err))
    }

    deleteGoal = () => {
        let updatedGoals = this.props.goals.filter(goal => goal.id !== this.state.goalToDeleteId)
        const db = firebase.firestore();
        db.collection("users").doc(this.props.localId).update({
            goals: updatedGoals
        })
        .then(() => {
            M.toast({ html: 'Goal deleted.'})
            this.props.updateGoals()
        })
        .catch(err => console.log(err))
    }

    openConfirmationDialog = (goalId) => {
        this.setState({
            goalToDeleteId: goalId
        }, () => {
            // confirmation modal 
            var elems = document.querySelector('#confirmationModal');
            let instance = M.Modal.init(elems, {});
            instance.open()
        })
    }


    render() {
        const { goals } = this.props; 

        return (
            <div id="goal">
                    <h5>Your Goals</h5>
                    <div id="add-goal">
                        <h6>Add a goal</h6>
                        <input value={this.state.goalTarget} type="text" placeholder="Select goal target date" className="datepicker"></input>
                        <input 
                            type="text" 
                            value={this.state.goalWeight} 
                            id="goalWeight" 
                            placeholder="Enter a target weight" 
                            onChange={this.handleChange}>
                        </input>
                        <button 
                            onClick={this.addGoal}
                            className={ this.state.goalTarget && this.state.goalWeight ?  "waves-effect waves-light btn" : "waves-effect waves-light btn disabled"}>
                                Add Goal
                        </button>
                    </div>
                    {
                        goals.map(goal => {
                            return (
                                <div className="goal-item">
                                <div>
                                    <p>Target Weight: {goal.goalWeight}</p>
                                    <p>Goal Date: {  DateTime.fromISO(new Date(goal.goalTarget.seconds * 1000 ).toISOString()).toFormat('yyyy LLL dd') }</p>
                                </div>
                                
                                <div className="delete-goal modal-trigger" onClick={() => this.openConfirmationDialog(goal.id)}>
                                    <i className="fas fa-trash"></i>
                                </div>
                            </div>
                            )
                        })
                    }
                    {/* confirmation modal */}
                    <div id="confirmationModal" className="modal">
                        <div className="modal-content">
                            <h4>Confirm Goal Deletion</h4>
                            <p>Are you sure you want to delete your goal?</p>
                        </div>
                        <div className="modal-footer">
                            <a className="modal-close waves-effect btn-flat" >No</a>
                            <a className="modal-close waves-effect btn-flat" onClick={this.deleteGoal}>Yes</a>
                        </div>
                    </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      localId: state.localId,
    }
  }

export default connect(mapStateToProps)(Goal);