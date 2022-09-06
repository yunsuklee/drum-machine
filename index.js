import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './main.css';
import { bankOne, bankTwo } from './banks.js';

class DrumPad extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  playSound = () => {
    let sound = document.getElementById(this.props.keyTrigger);
    sound.currentTime = 0;
    if (this.props.power === 'right') {
      sound.volume = this.props.volume / 100;
    } else {
      sound.volume = 0;
    }
    sound.play();
    this.props.updateDisplay(this.props.clipId.replace(/-/g, ' '));
  }
  handleKeyPress = (event) => {
    if (event.keyCode === this.props.keyCode) this.playSound();
  }

  render() {
    return(
      <div 
        className={this.props.class}
        id={this.props.clipId}
        onClick={this.playSound}
        onKeydown={this.handleKeyPress}
      >
        {this.props.keyTrigger}
        <audio
          className="clip"
          id={this.props.keyTrigger}
          src={this.props.clip}
        />
      </div>
    );
  }
}

class Drum extends React.Component {
  render() {
    let padBank = this.props.currentPadBank.map((drumObj, i, padBankArr) => {
      return (
        <DrumPad
          class={padBankArr[i].class}
          clip={padBankArr[i].url}
          clipId={padBankArr[i].id}
          keyCode={padBankArr[i].keyCode}
          keyTrigger={padBankArr[i].keyTrigger}
          volume={this.props.volume}
          updateDisplay={this.props.updateDisplay}
          power={this.props.power}
        />
      );
    });
    return <div id="drum">{padBank}</div>
  }
}

class App extends React.Component {
  state = {
    power: 'right',
    display: '',
    volume: 50,
    bank: 'left',
    currentPadBank: bankOne
  };

  handleClick = (event) => {
    event.preventDefault();

    if (event.target.id === 'power') {
      if (this.state.power === 'right') {
        this.setState({
          power: 'left',
        });
        this.updateDisplay('off');
      } else {
        this.setState({
          power: 'right',
          display: 'on',
          volume: this.state.volume
        });
      }
    } else if (event.target.id === 'bank') {
      if (this.state.bank === 'right') {
        this.setState({
          bank: 'left',
          currentPadBank: bankOne
        });
        this.updateDisplay('Heater Kit');
      } else {
        this.setState({
          bank: 'right',
          currentPadBank: bankTwo
        });
        this.updateDisplay('Smooth Piano Kit');
      }
    }
  }
  handleVolume = (event) => {
    event.preventDefault();

    this.setState({
      volume: event.target.value
    });
    setTimeout(() => {
      this.updateDisplay('Volume: ' + this.state.volume);
    }, 50);
  }
  updateDisplay = (displayUpdate) => {
    if (this.state.power === 'right') {
      this.setState({
        display: displayUpdate
      });
      setTimeout(() => {
        this.clearDisplay();
      }, 1000);
    }
  }
  clearDisplay = () => {
    this.setState({
      display: ''
    });
  }

  render() {
    return (
      <div id="drum-machine">
        <Drum
          currentPadBank={this.state.currentPadBank}
          volume={this.state.volume}
          updateDisplay={this.updateDisplay}
          power={this.state.power}
        />
        <div id="drum-config">
          <div id="power-button">
            <h3 className="button-title">POWER</h3>
            <div className="button-container">
              <div
                id="power"
                className="button"
                onClick={this.handleClick}
                style={{ float: this.state.power }}
              />
            </div>
          </div>
          <div id="display">{this.state.display}</div>
          <div id="volume">
            <input
              id="volume-range"
              max="100"
              min="0"
              onChange={this.handleVolume}
              setp="0.1"
              type="range"
            />
          </div>
          <div id="bank-button">
            <h3 className="button-title">BANK</h3>
            <div className="button-container">
              <div
                id="bank"
                className="button"
                onClick={this.handleClick}
                style={{ float: this.state.bank }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);