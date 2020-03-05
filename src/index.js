import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const initGrid = () => {
  return [
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

class GridCell extends React.Component {
  render() {
    let { cellValue, addCellValue, row, col } = this.props;
    return <span onClick={() => { addCellValue(row, col) }}>{cellValue}</span>;
  }
}

class GridRow extends React.Component {
  render() {
    let { rowValues, addCellValue, row } = this.props;
    let rowComps = [];
    for (let [index, cellValue] of rowValues.entries()) {
      rowComps.push(<GridCell cellValue={cellValue} addCellValue={addCellValue} row={row} col={index} />)
    }
    return <div>{rowComps}</div>;
  }
}

class SudokuGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {grid: initGrid()};
    this.addCellValue = this.addCellValue.bind(this);
    this.solve = this.solve.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({grid: initGrid()})
  }

  addCellValue(row, col) {
    this.setState(state => {

      // deep copy
      let updatedGrid = JSON.parse(JSON.stringify(state.grid));

      // add 1. set it to 0 if 9 now.
      let currVal = updatedGrid[row][col];
      updatedGrid[row][col] = currVal === 9 ? 0 : updatedGrid[row][col] + 1;
      return { grid: updatedGrid };
    });
  }

  render() {
    let grid = [];
    for (let [index, row] of this.state.grid.entries()) {
      grid.push(<GridRow rowValues={row} addCellValue={this.addCellValue} row={index} />)
    }
    return (
      <div>
        {grid}
        <button type="button" onClick={this.solve}>解く</button>
        <button type="button" onClick={this.reset}>リセット</button>
      </div>
    );
  }

  isValid(grid) {

    return true;
  }

  solve(e, row=0, col=0, grid=JSON.parse(JSON.stringify(this.state.grid))) {
    let currVal = grid[row][col];

    // if the cell does not have value yet, go throuhg 1 to 9 and try if each works.
    let foundCellValue = false;
    if (currVal === 0) {
      for (let num of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        grid[row][col] = num;
        if (this.isValid(grid)) {
          foundCellValue = true;
          break;
        } else {
          continue;
        }
      }
    }

    // if not found solution for the cell, fail and stop.
    if (!foundCellValue) {
      return;
    }

    // if the cell is the last one, done.
    if (row === 8 && col === 8) {

      this.setState({ grid: grid, solved: true });
    } else {
      let [nextRow, nextCol] = nextRowCol(row, col);
      
      this.solve(e, nextRow, nextCol, grid)
    }
  }
}

function nextRowCol(row, col) {
  if (col === 8) {
    row++;
    col = 0;
  } else {
    col++;
  }
  return [row, col];
}
ReactDOM.render(<SudokuGrid />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
