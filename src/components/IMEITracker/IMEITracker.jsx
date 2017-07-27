import React from 'react';
import PropTypes from 'prop-types';

class IMEITracker extends React.Component {

  static propTypes = {
    imei: PropTypes.string.isRequired,
    trackerEndpoint: PropTypes.string.isRequired,
  };
  
  state = {
    data: [],
    connected: false,
  };

  componentWillMount() {
    let { trackerEndpoint, imei } = this.props;
    if(!trackerEndpoint.endsWith('/')) {
      trackerEndpoint = `${trackerEndpoint}/`;
    }
    const eventSource = new EventSource(`${trackerEndpoint}${imei}`);
    eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.setState(prevState => ({
          data: [...prevState.data, data],
        }));
      } catch (error) {

      }
    });
    eventSource.addEventListener('close', () => {
      this.setState({
        connected: false,
      });
    });

    eventSource.addEventListener('open', () => {
      this.setState({
        connected: true,
      });
    });

    this.eventSource = eventSource;
  }

  componentWillUnmount() {
    this.eventSource.close();
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