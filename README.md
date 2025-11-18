# Pathfinding Visualizer

**Description:** This web app visualizes pathfinding algorithms (BFS, DFS, and A*) on a 2D grid. Users can draw obstacles, set start and end points, and watch how each algorithm explores the grid to find a path.

## Features
- **Breadth-First Search (BFS):** Finds shortest path in an unweighted grid.
- **Depth-First Search (DFS):** Explores paths deeply, illustrating backtracking.
- **A* Search (optional):** Uses a Manhattan heuristic (f = g + h) to efficiently find shortest path.
- **Interactive Controls:** Click/drag to add/remove walls, set start/end points, and choose algorithm.
- **Visualization:** Cells change color as they’re visited (blue) and the final path (yellow).

<img width="920" height="713" alt="image" src="https://github.com/user-attachments/assets/a718d30c-2923-406b-bd7f-b23346733e92" />

## Getting Started

**How to Run Locally:**
1. Clone or download this repository.
2. Open `index.html` in a web browser (no server needed).
3. Use the on-page controls to draw walls, choose algorithms, and visualize the search.

```bash
git clone https://github.com/NematArif/pathfinding-visualizer.git
cd pathfinding-visualizer
# Then open index.html in your browser
