import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
class GridCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { cellValue, addCellValue, row, col } = this.props;
    return <span onClick={() => { addCellValue(row, col) }}>{cellValue}</span>;
  }
}

class GridRow extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    let { rowValues, addCellValue, row } = this.props;
    let rowComps = [];
    for (let [index, cellValue] of rowValues.entries()) {
      rowComps.push(<GridCell cellValue={cellValue} addCellValue={addCellValue} row={row} col={index}/>)
    }
    return <div>{rowComps}</div>;
  }
}

class SudokuGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid:
        [
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
    };
    this.addCellValue = this.addCellValue.bind(this);
  }

  addCellValue(row, col) {
    this.setState(state => {
      // deep copy
      let updatedGrid = JSON.parse(JSON.stringify(state.grid));
      updatedGrid[row][col] = updatedGrid[row][col] + 1;
      return { grid: updatedGrid };
    });
  }

  render() {
    let grid = [];
    for (let [index, row] of this.state.grid.entries()) {
      grid.push(<GridRow rowValues={row} addCellValue={this.addCellValue} row={index}/>)
    }
    return (
      <div>
        {grid}
        <button type="button">解く</button>
      </div>
    );
  }
}
ReactDOM.render(<SudokuGrid />, document.getElementById('root'));

// function tick() {
//   let now = new Date();
//   let secondsStyle = { marginLeft: now.getSeconds() * 5 + "px" };
//   const element = (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {now.toLocaleTimeString()}.</h2>
//       <h3 style={secondsStyle}>{now.getSeconds()}</h3>
//     </div>
//   );
//   // highlight-next-line
//   ReactDOM.render(element, document.getElementById('root'));
// }

// setInterval(tick, 1000);






// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
