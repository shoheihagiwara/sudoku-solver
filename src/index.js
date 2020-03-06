import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const block2array = (grid, row, col) => {
  // get block start row,col first
  let rowIndex = Math.floor(row / 3) * 3;
  let colIndex = Math.floor(col / 3) * 3;

  return [
    grid[rowIndex][colIndex], grid[rowIndex][colIndex + 1], grid[rowIndex][colIndex + 2],
    grid[rowIndex + 1][colIndex], grid[rowIndex + 1][colIndex + 1], grid[rowIndex + 1][colIndex + 2],
    grid[rowIndex + 2][colIndex], grid[rowIndex + 2][colIndex + 1], grid[rowIndex + 2][colIndex + 2]
  ];
}

const numberLooksGood = (grid, row, col) => {
  let num = grid[row][col];

  // row
  if (grid[row].filter(n => n === num).length > 1) {
    return false;
  }

  // col
  if (grid.filter((v, i) => v[col]).filter(n => n === num).length > 1) {
    return false;
  }

  // block
  if (block2array(grid, row, col).filter(n => n === num).length > 1) {
    return false;
  }

  return true;
}

const initSudoku = () => {
  return {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    solved: false
  }
};

const exampleSudoku = () => {
  return {
    grid: [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0]
    ],
    solved: false
  }
}

const solvedSudoku = () => {
  return {
    grid: [
      [4, 3, 5, 2, 6, 9, 7, 8, 1],
      [6, 8, 2, 5, 7, 1, 4, 9, 3],
      [1, 9, 7, 8, 3, 4, 5, 6, 2],
      [8, 2, 6, 1, 9, 5, 3, 4, 7],
      [3, 7, 4, 6, 8, 2, 9, 1, 5],
      [9, 5, 1, 7, 4, 3, 6, 2, 8],
      [5, 1, 9, 3, 2, 6, 8, 7, 4],
      [2, 4, 8, 9, 5, 7, 1, 3, 6],
      [7, 6, 3, 4, 1, 8, 2, 5, 9]
    ],
    solved: false
  }
}

const anotherExampleSudoku = () => {
  return {
    grid: [
      [4, 3, 5, 2, 6, 9, 7, 8, 1],
      [6, 8, 2, 5, 7, 1, 4, 9, 3],
      [1, 9, 7, 8, 3, 4, 5, 6, 2],
      [8, 2, 6, 1, 9, 5, 3, 4, 7],
      [3, 7, 4, 6, 8, 2, 9, 1, 5],
      [9, 5, 1, 7, 4, 3, 6, 2, 8],
      [5, 1, 9, 3, 2, 6, 8, 7, 4],
      [2, 4, 8, 9, 5, 7, 1, 3, 6],
      [7, 6, 3, 4, 1, 8, 2, 5, 0]
    ],
    solved: false
  }
}

const foundSolution = grid => {
  return rowsValid(grid) && colsValid(grid) && blocksValid(grid);
}

const rowsValid = grid => {
  // check each row has each number exactly one time.
  for (let row of grid) {
    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      if (row.filter(n => n === i).length !== 1) {
        return false;
      }
    }
  }
  return true;
}

const colsValid = grid => {
  // transpose so that comparison becomes easier.
  let tmpGrid = grid[0].map((col, i) => grid.map(row => row[i]));
  return rowsValid(tmpGrid);
}

const blocksValid = grid => {
  let blocks = [];
  // loop through (0,0), (0,3), (0,6), (3,0), ..., (8,6) and make blocks
  for (let rowIndex = 0; rowIndex < 9; rowIndex = rowIndex + 3) {
    for (let colIndex = 0; colIndex < 9; colIndex = colIndex + 3) {
      blocks.push(
        [
          grid[rowIndex][colIndex], grid[rowIndex][colIndex + 1], grid[rowIndex][colIndex + 2],
          grid[rowIndex + 1][colIndex], grid[rowIndex + 1][colIndex + 1], grid[rowIndex + 1][colIndex + 2],
          grid[rowIndex + 2][colIndex], grid[rowIndex + 2][colIndex + 1], grid[rowIndex + 2][colIndex + 2]
        ]
      );
    }
  }
  for (let block of blocks) {
    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      if (block.filter(n => n === i).length !== 1) {
        return false;
      }
    }
  }
  return true;
}

class GridCell extends React.Component {
  render() {
    let { cellValue, addCellValue, row, col } = this.props;
    return <span style={{ fontSize: "2rem" }} onClick={() => { addCellValue(row, col) }}>{cellValue}</span>;
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
    this.state = initSudoku();
    this.addCellValue = this.addCellValue.bind(this);
    this.solve = this.solve.bind(this);
    this.reset = this.reset.bind(this);
    this.setExample = this.setExample.bind(this);
  }

  reset() {
    this.setState(initSudoku());
  }

  setExample() {
    this.setState(exampleSudoku());
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
        <button type="button" onClick={this.setExample}>例</button>
        <button type="button" onClick={() => this.setState(solvedSudoku())}>solved sudoku</button>
      </div>
    );
  }


  solve(e, row = 0, col = 0, grid = JSON.parse(JSON.stringify(this.state.grid))) {
    let currVal = grid[row][col];
    console.log("row, col, currVal: ", row, col, currVal);

    // what we do depends on if you are on the last cell or not.
    if (row === 8 && col === 8) {
      // we are on the last cell
      if (currVal === 0) {
        for (let num of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
          grid[row][col] = num;
          if (foundSolution(grid)) {
            console.log("Solved! grid: ", grid);
            this.setState({ grid: grid, solved: true });
            return true;
          }
        }
        console.log("Solution not found...");
        return false;
      } else {
        // the cell is already filled. we can't do anything about it.
        // just check if current state is the solution.
        let solutionFound = foundSolution(grid);
        if (solutionFound) {
          console.log("Solved! grid: ", grid);
          this.setState({ grid: grid, solved: true });
        } else {
          console.log("Solution not found...");
        }
        return solutionFound;
      }

    } else {
      // we are NOT on the last cell
      let [nextRow, nextCol] = nextRowCol(row, col);
      if (currVal === 0) {
        for (let num of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
          grid[row][col] = num;
          // performance tuning: check if the number we are trying now is good. don't wait until the last cell.
          if (numberLooksGood(grid, row, col)) {
            let foundSolution = this.solve(e, nextRow, nextCol, grid);
            if (foundSolution) {
              return true;
            } else {
              continue;
            }
          }
        }
        // clean up
        grid[row][col] = 0;
        return false;
      } else {
        // the cell is already filled. we can't do anything about it, so just go to next cell and pass through result.
        return this.solve(e, nextRow, nextCol, grid);
      }
    }





    /*
    // if the cell does not have value yet, go throuhg 1 to 9 and try if any works.
    let foundCellValue = false;
    if (currVal === 0) {
      for (let num of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        grid[row][col] = num;
        this.solve(e)
      }
    } else {
      foundCellValue = true;
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
    */
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
