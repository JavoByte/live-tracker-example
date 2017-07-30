import React from 'react';
import SocketClusterClient from 'socketcluster-client';
import GoogleMapReact from 'google-map-react';
import IMEITracker from './components/IMEITracker';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.startTracking = (imei) => {
      if(!imei) return;
      this.setState(prevState => ({
        imeis: {
          ...prevState.imeis,
          [imei]: null,
        }
      }));
    }

    this.onLocationUpdate = (imei, location) => {
      this.setState((prevState) => ({
        imeis: {
          ...prevState.imeis,
          [imei]: location,
        }
      }));
    };
  }

  componentWillMount() {
    this.socketCluster = SocketClusterClient.connect({
      hostname: 'localhost',
      port: 8000,
    });
    this.socketCluster.on('connect', () => {
      console.log("Socket cluster connected");
    });
  }

  state = {
    imeis: {}
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
              <input type="text" className="form-control" name="imei" id="imei" ref={(ref) => { this.imeiInput = ref; }} />
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
            Object.keys(this.state.imeis).map((imei, idx) => (
              <div className="col-md-4" key={`${imei}-${idx}`}>
                <IMEITracker imei={imei} socketCluster={this.socketCluster} onLocationUpdate={(location) => this.onLocationUpdate(imei, location)} />
              </div>
            ))
          }
        </div>

        <div className="map-container">
          {
            Object.keys(this.state.imeis).length > 0 ?
              <GoogleMapReact
                defaultCenter={{
                  lat: 19.3929468,
                  lng: -98.9881596,
                }}
                defaultZoom={14}
              >
                {
                  Object.keys(this.state.imeis).map(imei => (

                    this.state.imeis[imei] ?
                      <Marker
                        lat={this.state.imeis[imei].latitude}
                        lng={this.state.imeis[imei].longitude}
                      />
                    : null
                  ))
                }
              </GoogleMapReact>
            : null
          }
        </div>
      </div>
    );
  }
}

function Marker() {
  return (
    <div className="marker" />
  );
}

export default App;
