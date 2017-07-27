import React from 'react';
import IMEITracker from './components/IMEITracker';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.startTracking = (imei) => {
      if(!imei) return;
      this.setState(prevState => ({
        imeis: [...prevState.imeis, imei],
      }));
    }
  }

  state = {
    imeis: []
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="form-group">
              <label htmlFor="imei">
                IMEI to track
              </label>
              <input type="number" className="form-control" name="imei" id="imei" ref={(ref) => { this.imeiInput = ref; }} />
            </div>
            <div className="text-right">
              <button className="btn btn-primary" onClick={() => this.startTracking(this.imeiInput.value)}>
                Start tracking
              </button>
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          {
            this.state.imeis.map((imei, idx) => (
              <div className="col-md-4" key={`${imei}-${idx}`}>
                <IMEITracker imei={imei} trackerEndpoint="http://localhost:8080/api/live" />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
