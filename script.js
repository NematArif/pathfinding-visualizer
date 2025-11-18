const TOTAL_ROWS = 20;
const TOTAL_COLS = 20;

// I keep reassigning things while testing, so `let` it is.
let board = [];
let startPt = null;
let finishPt = null;
let dragging = false;
let pickingStart = false;
let pickingEnd = false;

const boardEl = document.getElementById('grid');
const algoDropdown = document.getElementById('algorithm');
const runBtn = document.getElementById('startBtn');
const clearBtn = document.getElementById('resetBtn');
const startSetter = document.getElementById('setStartBtn');
const endSetter = document.getElementById('setEndBtn');

// Just building the grid — got tired of rewriting this.
function buildGrid() {
    boardEl.innerHTML = '';
    board = [];

    for (let rr = 0; rr < TOTAL_ROWS; rr++) {
        let rowRef = [];

        for (let cc = 0; cc < TOTAL_COLS; cc++) {
            const cellEl = document.createElement('div');
            cellEl.classList.add('cell');

            // Storing position on the DOM element
            cellEl.dataset.r = rr;
            cellEl.dataset.c = cc;

            // Mouse interactions (probably could consolidate but meh)
            cellEl.addEventListener('mousedown', handleMouseDown);
            cellEl.addEventListener('mouseenter', handleMouseHover);
            cellEl.addEventListener('mouseup', handleMouseUp);

            boardEl.appendChild(cellEl);
            rowRef.push(cellEl);
        }

        board.push(rowRef);
    }

    startPt = { r: 0, c: 0 };
    finishPt = { r: TOTAL_ROWS - 1, c: TOTAL_COLS - 1 };

    board[startPt.r][startPt.c].classList.add('start');
    board[finishPt.r][finishPt.c].classList.add('end');
}

function handleMouseDown(evt) {
    const el = evt.target;
    const rr = parseInt(el.dataset.r);
    const cc = parseInt(el.dataset.c);

    if (pickingStart) {
        // Replace old start, if it exists
        if (startPt) board[startPt.r][startPt.c].classList.remove('start');

        startPt = { r: rr, c: cc };
        el.classList.remove('wall', 'end');
        el.classList.add('start');

        pickingStart = false;  // auto-disable because I kept forgetting

    } else if (pickingEnd) {

        if (finishPt) board[finishPt.r][finishPt.c].classList.remove('end');

        finishPt = { r: rr, c: cc };
        el.classList.remove('wall', 'start');
        el.classList.add('end');

        pickingEnd = false;

    } else {
        dragging = true;

        // Avoid messing up endpoints
        if (!el.classList.contains('start') && !el.classList.contains('end')) {
            el.classList.toggle('wall');
        }
    }
}

function handleMouseHover(evt) {
    if (!dragging) return;

    const el = evt.target;
    if (!el.classList.contains('start') && !el.classList.contains('end')) {
        el.classList.add('wall'); 
    }
}

function handleMouseUp() {
    dragging = false;
}

// Random UI bindings — nothing fancy.
startSetter.addEventListener('click', () => {
    pickingStart = true;
    pickingEnd = false;
});

endSetter.addEventListener('click', () => {
    pickingEnd = true;
    pickingStart = false;
});

clearBtn.addEventListener('click', () => buildGrid());

runBtn.addEventListener('click', () => {
    wipeMarks();
    const chosenAlgo = algoDropdown.value;

    // A bit messy but whatever
    if (chosenAlgo === 'bfs') runBFS();
    else if (chosenAlgo === 'dfs') runDFS();
    else if (chosenAlgo === 'astar') runAStar();
});

// Clears "visited" and "path" classes
function wipeMarks() {
    for (let rr = 0; rr < TOTAL_ROWS; rr++) {
        for (let cc = 0; cc < TOTAL_COLS; cc++) {
            board[rr][cc].classList.remove('visited', 'path');
        }
    }
}

/* -----------------------------------
   BFS — Probably the cleanest algorithm
   ----------------------------------- */
function runBFS() {
    const q = [];
    const been = Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(false));
    const prevStep = Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(null));

    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

    q.push(startPt);
    been[startPt.r][startPt.c] = true;

    let reached = false;

    while (q.length && !reached) {
        const cur = q.shift();
        const { r, c } = cur;

        if (!(r === startPt.r && c === startPt.c)) {
            board[r][c].classList.add('visited');
        }

        if (r === finishPt.r && c === finishPt.c) {
            reached = true;
            break;
        }

        for (let [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < TOTAL_ROWS && nc >= 0 && nc < TOTAL_COLS) {
                if (!been[nr][nc] && !board[nr][nc].classList.contains('wall')) {
                    q.push({ r: nr, c: nc });
                    been[nr][nc] = true;
                    prevStep[nr][nc] = cur;
                }
            }
        }
    }

    // Trace-back (this part always feels clunky)
    if (reached) {
        let p = finishPt;
        while (!(p.r === startPt.r && p.c === startPt.c)) {
            const { r, c } = p;

            if (!(r === finishPt.r && c === finishPt.c)) {
                board[r][c].classList.add('path');
            }

            p = prevStep[r][c];
        }
    }
}

/* -----------------------------------
   DFS — classic but messy for grids
   ----------------------------------- */
function runDFS() {
    const st = [];
    const seen = Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(false));
    const prev = Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(null));
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

    st.push(startPt);
    seen[startPt.r][startPt.c] = true;

    let hitEnd = false;

    while (st.length && !hitEnd) {
        const cur = st.pop();
        const { r, c } = cur;

        if (!(r === startPt.r && c === startPt.c)) {
            board[r][c].classList.add('visited');
        }

        if (r === finishPt.r && c === finishPt.c) {
            hitEnd = true;
            break;
        }

        for (let [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < TOTAL_ROWS && nc >= 0 && nc < TOTAL_COLS) {
                if (!seen[nr][nc] && !board[nr][nc].classList.contains('wall')) {
                    st.push({ r: nr, c: nc });
                    seen[nr][nc] = true;
                    prev[nr][nc] = cur;
                }
            }
        }
    }

    if (hitEnd) {
        let p = finishPt;
        while (!(p.r === startPt.r && p.c === startPt.c)) {
            const { r, c } = p;

            if (!(r === finishPt.r && c === finishPt.c)) {
                board[r][c].classList.add('path');
            }

            p = prev[r][c];
        }
    }
}

/* -----------------------------------
   A* — feels overkill but it's cool
   ----------------------------------- */
function runAStar() {
    let open = [];
    let closed = new Set(); // Small note: storing string keys feels hacky, oh well.

    const prev = Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(null));
    const gScr = Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(Infinity));
    const fScr = Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(Infinity));

    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

    gScr[startPt.r][startPt.c] = 0;
    fScr[startPt.r][startPt.c] = manDist(startPt, finishPt);
    open.push(startPt);

    while (open.length > 0) {
        // find lowest fScore item
        let bestIndex = 0;

        // This loop is not optimal, but I'm not using a heap right now.
        for (let i = 1; i < open.length; i++) {
            const test = open[i];
            const cmp = open[bestIndex];
            if (fScr[test.r][test.c] < fScr[cmp.r][cmp.c]) bestIndex = i;
        }

        const cur = open.splice(bestIndex, 1)[0];
        const { r, c } = cur;

        if (!(r === startPt.r && c === startPt.c)) board[r][c].classList.add('visited');

        if (r === finishPt.r && c === finishPt.c) {
            // Rebuild path
            let p = finishPt;
            while (!(p.r === startPt.r && p.c === startPt.c)) {
                const { r, c } = p;
                if (!(r === finishPt.r && c === finishPt.c)) {
                    board[r][c].classList.add('path');
                }
                p = prev[r][c];
            }
            return;
        }

        closed.add(`${r},${c}`);

        for (let [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;

            if (nr >= 0 && nr < TOTAL_ROWS && nc >= 0 && nc < TOTAL_COLS && !board[nr][nc].classList.contains('wall')) {
                if (closed.has(`${nr},${nc}`)) continue;

                const maybeG = gScr[r][c] + 1;
                const exists = open.find(n => n.r === nr && n.c === nc);

                if (!exists) open.push({ r: nr, c: nc });
                else if (maybeG >= gScr[nr][nc]) continue;

                // Update path + scores
                prev[nr][nc] = cur;
                gScr[nr][nc] = maybeG;
                fScr[nr][nc] = maybeG + manDist({ r: nr, c: nc }, finishPt);
            }
        }
    }
}

// Simple Manhattan distance
function manDist(a, b) {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

// Initialize grid when page loads
document.addEventListener('DOMContentLoaded', () => buildGrid());
