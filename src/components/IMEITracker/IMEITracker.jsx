import React from 'react';
import PropTypes from 'prop-types';

class IMEITracker extends React.Component {

  static propTypes = {
    imei: PropTypes.string.isRequired,
    socketCluster: PropTypes.shape({
      subscribe: PropTypes.func.isRequired,
    }),
    onLocationUpdate: PropTypes.func,
  };
  
  state = {
    data: [],
    connected: false,
  };

  componentWillMount() {
    let { imei } = this.props;
    const channel = this.props.socketCluster.subscribe(imei);
    channel.watch((data) => {
      console.log('Received data from channel', imei, data);
      this.setState(prevState => ({
        data: [data, ...prevState.data].splice(0, 5),
      }));
      if (this.props.onLocationUpdate) {
        this.props.onLocationUpdate(data);
      }
    });
  }

  componentWillUnmount() {
    this.channel.unsubscribe();
  }

  render() {
    return (
      <div className={`panel ${this.state.connected ? 'panel-default' : 'panel-danger'}`}>
        <div className="panel-heading">
          <h3 className="panel-title">
            { this.props.imei }
          </h3>
        </div>
        <div className="list-group">
          {
            this.state.data.map((data) => (
              <div key={data.timestamp} className="list-group-item">
                <h4 className="list-group-item-heading">
                  { data.latitude }, { data.longitude }
                </h4>
                <p className="list-group-item-text">
                  { data.timestamp }
                </p>
              </div>
            ))
          }
          {
            this.state.data.length === 0 ?
              <div className="list-group-item list-group-item-info">
                No data to display
              </div>
            : null
          }
        </div>
      </div>
    )
  }
}

export default IMEITracker;