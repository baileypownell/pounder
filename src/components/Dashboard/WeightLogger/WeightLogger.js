import React from 'react';
import M from 'materialize-css';
import './WeightLogger.scss';
import { connect } from 'react-redux';
import * as actions from '../../../store/actionCreators';

export class WeightLogger extends React.Component {

  state = {
    formInputEmpty: true,
    todaysWeight: 0,
  }

  componentDidMount() {
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {});
  }

  handleChange = (e) => {
    if (e.target.value > 1) {
      this.setState({
        formInputEmpty: false,
        todaysWeight: e.target.value
      });
    } else {
      this.setState({
        formInputEmpty: true
      });
    }
  }

  handleUpdateChange = (e) => {
    this.setState({
      todaysWeight: e.target.value
    });
  }


  logWeight = (e) => {
    // check to see if there has been a weight entered in the past 24 hours... redux todaysWeight should be set from database and only allowed to be updated if null
    if (this.state.todaysWeight > 0 && !this.props.todaysWeight) {
      this.props.updateTodaysWeight(parseInt(this.state.todaysWeight));
      console.log('here')
      const db = firebase.firestore();
      let date = new Date();
      let updatedWeights = this.props.weights.concat({
        date: {date},
        weight: this.state.todaysWeight});
      db.collection("users").doc(this.props.localId).update({
        weights: updatedWeights
      })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    }
  } 
  

  updateTodaysWeight = () => {
      let allWeights = this.props.weights;
      console.log('allWeights ', allWeights)
      let recordToUpdate = allWeights[0];
      recordToUpdate.weight = this.state.todaysWeight;
      allWeights.shift();
      console.log('allWeights = ', allWeights)
      // update redux
      this.props.editTodaysWeight(parseInt(this.state.todaysWeight), allWeights);
      // update firebase users database to hold today's new weight value
      // delete last item
      allWeights.pop();
      let date = new Date();
      let updatedWeights = allWeights.concat({
        date: {date},
        weight: this.state.todaysWeight
      });
      const db = firebase.firestore();
      db.collection("users").doc(this.props.localId).update({
          weights: updatedWeights
      })
      .then(() => {
        M.toast({html: 'Weight updated.'})
      })
      .catch(err => {
        console.log(err);
        M.toast({html: 'Weight could not be updated.'})
      })
    }


  render() {
    return (
      <div id="weight-logger">
          <div id="modal1" className="modal">
            <div className="modal-content">
              <div className="input-field">
                <label for="update-weight">Update today's weight</label>
                <input type="text" id="update-weight" onChange={this.handleUpdateChange}></input>
              </div>
            </div>
            <div className="modal-footer">
              <a 
                onClick={this.updateTodaysWeight} 
                className="modal-close waves-effect waves-light btn">
                Update
              </a>
            </div>
          </div>
          <form>
            <div className="input-field">
              <label for="weight">Record Weight</label>
              <input id="weight" onChange={this.handleChange} type="text"></input>
            </div>
              <div>
                <button
                  onClick={this.logWeight} 
                  className={this.state.formInputEmpty || this.props.todaysWeight > 0 ? "button-disabled waves-effect waves-light btn" : "waves-effect waves-light btn"}>
                    Log Weight
                </button>
                <button
                  
                  data-target="modal1"
                  className={this.props.todaysWeight > 0 ? "waves-effect waves-light btn modal-trigger" : "button-disabled waves-effect waves-light btn"}>
                    Edit today's weight
                </button>
              </div>
          </form>
        {this.props.todaysWeight ? <h6>Today's Weight: {this.props.todaysWeight} lbs.</h6> : null }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    todaysWeight: state.todaysWeight,
    localId: state.localId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTodaysWeight: (todaysWeight) => dispatch(actions.setTodaysWeight(todaysWeight)),
    editTodaysWeight: (todaysWeight, updatedWeights) => dispatch(actions.editTodaysWeight(todaysWeight, updatedWeights))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WeightLogger);
