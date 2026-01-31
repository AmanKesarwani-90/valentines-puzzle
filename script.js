const puzzle = document.getElementById("puzzle");
const size = 3;
let tiles = [];
let emptyIndex = size * size - 1;

function createTiles() {
    for (let i = 0; i < size * size; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.correct = i;

        const x = i % size;
        const y = Math.floor(i / size);
        tile.style.backgroundPosition = `-${x * 150}px -${y * 150}px`;

        if (i === emptyIndex) {
            tile.classList.add("hidden");
        }

        tile.addEventListener("click", function() {
            const currentIndex = tiles.indexOf(this);
            moveTile(currentIndex);
        });
        tiles[i] = tile;
        puzzle.appendChild(tile);
    }
}

function shuffle() {
    for (let i = 0; i < 100; i++) {
        const possibleMoves = [];
        const emptyRow = Math.floor(emptyIndex / size);
        const emptyCol = emptyIndex % size;

        if (emptyRow > 0) possibleMoves.push(emptyIndex - size);
        if (emptyRow < size - 1) possibleMoves.push(emptyIndex + size);
        if (emptyCol > 0) possibleMoves.push(emptyIndex - 1);
        if (emptyCol < size - 1) possibleMoves.push(emptyIndex + 1);

        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        swapTiles(randomMove, emptyIndex);
    }
}

function swapTiles(index1, index2) {
    [tiles[index1], tiles[index2]] = [tiles[index2], tiles[index1]];

    if (index1 === emptyIndex) {
        emptyIndex = index2;
    } else if (index2 === emptyIndex) {
        emptyIndex = index1;
    }

    renderPuzzle();
}

function renderPuzzle() {
    puzzle.innerHTML = '';
    tiles.forEach(tile => puzzle.appendChild(tile));
}

function moveTile(clickedIndex) {
    const clickedRow = Math.floor(clickedIndex / size);
    const clickedCol = clickedIndex % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent =
        (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
        (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

    if (!isAdjacent) return;

    swapTiles(clickedIndex, emptyIndex);
    checkSolved();
}

function checkSolved() {
    const solved = tiles.every(
        (tile, i) => parseInt(tile.dataset.correct) === i
    );

    if (solved) {
        tiles[emptyIndex].classList.remove("hidden");
        document.getElementById("message").style.opacity = 1;
        document.getElementById("buttons").style.display = "block";
    }
}

document.getElementById("yes").onclick = () => {
    alert("YAY 💖💖💖");
};

document.getElementById("no").onclick = () => {
    alert("That option is currently unavailable 😌");
};

document.getElementById("no").addEventListener("mouseenter", function() {
    const maxX = window.innerWidth - this.offsetWidth - 20;
    const maxY = window.innerHeight - this.offsetHeight - 20;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    this.style.position = "fixed";
    this.style.left = randomX + "px";
    this.style.top = randomY + "px";
});

createTiles();
shuffle();