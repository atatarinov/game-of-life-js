'use strict';

let gameOfLife = {
  width: 12,
  height: 12,
  stepInterval: null,

  createAndShowBoard: function () {
    const goltable = document.createElement("tbody");

    let tablehtml = '';
    for (let h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    const board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  getCell: function (row, col) {
    let cell = document.getElementById(`${row}-${col}`);
    if (!cell) return null;
    cell.row = row;
    cell.col = col;
    return cell;
  },

  forEachCell: function (iteratorFunc) {
    for (let col = 0; col < this.width; col++) {
      for (let row = 0; row < this.height; row++) {
        let cell = this.getCell(row, col);
        iteratorFunc(cell, row, col);
      }
    }
  },

  neighborhood: function (cell) {
    let neighbors = [];
    for (let col = cell.col - 1; col <= cell.col + 1; col++) {
      for (let row = cell.row - 1; row <= cell.row + 1; row++) {
        let isCell = (row === cell.row && col === cell.col);
        if (!isCell) {
          let theCell = this.getCell(row, col);
          if (theCell) {
            neighbors.push(theCell);
          }
        }
      }
    }
    return neighbors;
  },

  getNextState: function (cell, row, col) {
    let livingNeighbors = this.neighborhood(cell)
      .map((el) => el.dataset.status === 'alive' ? 1 : 0)
      .reduce((sum, alive) => sum + alive, 0);

    if (cell.dataset.status === 'alive') {
      return (livingNeighbors === 2 || livingNeighbors === 3);
    } else {
      return (livingNeighbors === 3);
    }
  },

  applyState: function (nextState) {
    this.forEachCell((cell, row, col) => {
      let status = nextState[col][row] ? 'alive' : 'dead';
      cell.className = status;
      cell.dataset.status = status;
    });

  },

  setupBoardEvents: function () {

    let onCellClick = function (e) {

      if (this.dataset.status === 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
    };

    window.board.addEventListener('click', (e) => onCellClick.call(e.target));
    window.step_btn.addEventListener('click', () => this.step());
    window.play_btn.addEventListener('click', () => this.enableAutoPlay());
    window.clear_btn.addEventListener('click', () => this.clear());
    window.reset_btn.addEventListener('click', () => this.randomize());

  },

  step: function () {
    let nextState = new Array(this.width).fill('placeholder').map(el => []);
    this.forEachCell((cell, row, col) => {
      nextState[col][row] = this.getNextState(cell, row, col);
    });

    this.applyState(nextState);
  },

  enableAutoPlay: function () {
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    } else {
      this.stepInterval = setInterval(() => this.step(), 500);
    }
  },

  clear: function() {
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }

    this.applyState(new Array(this.width).fill('placeholder').map(el => []));
  },

  randomize: function() {
    let randomState = new Array(this.width).fill('placeholder')
      .map(el => new Array(this.height).fill('placeholder')
        .map(cell => Math.random() <= 0.5)
      );
    this.applyState(randomState);
  }

};

gameOfLife.createAndShowBoard();
