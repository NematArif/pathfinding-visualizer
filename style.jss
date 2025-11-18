body {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px;
}
#controls {
  margin-bottom: 10px;
}
#grid {
  display: inline-grid;
  grid-template-columns: repeat(20, 25px);
  grid-template-rows: repeat(20, 25px);
  gap: 1px;
}
.cell {
  width: 25px;
  height: 25px;
  background-color: #fff;
  border: 1px solid #ccc;
}
.cell.wall {
  background-color: #444;
}
.cell.start {
  background-color: #4CAF50; /* green */
}
.cell.end {
  background-color: #f44336; /* red */
}
.cell.visited {
  background-color: #2196F3; /* blue */
}
.cell.path {
  background-color: #FFEB3B; /* yellow */
}
