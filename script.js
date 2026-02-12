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
    emptyIndex = (index1 === emptyIndex) ? index2 : index1;
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

    const isAdjacent = (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
                       (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

    if (!isAdjacent) return;
    swapTiles(clickedIndex, emptyIndex);
    checkSolved();
}

function checkSolved() {
    const solved = tiles.every((tile, i) => parseInt(tile.dataset.correct) === i);
    if (solved) {
        tiles[emptyIndex].classList.remove("hidden");
        document.getElementById("message").style.opacity = 1;
        document.getElementById("buttons").style.display = "block";
    }
}

// ACTION BUTTONS
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
let scale = 1;

yesBtn.onclick = () => {
    // This replaces the puzzle with your romantic message
    document.querySelector('.container').innerHTML = `
        <div style="animation: fadeIn 2s ease-in-out; padding: 10px;">
            <p style="font-size: 1.25em; line-height: 1.6; color: #444; font-style: italic; margin-bottom: 20px;">
                "In every version of my life, <br> 
                I would always find my way to you."
            </p>
            <h2 style="color: #ff5c8d; font-size: 1.6em; margin-bottom: 20px; font-weight: bold;">
                Happy Valentine’s Day, love❤️
            </h2>
            <img src="image.jpg" style="width: 100%; border-radius: 15px; box-shadow: 0 10px 30px rgba(255,105,180,0.3);">
        </div>
    `;

    // Starts the floating hearts celebration
    setInterval(createHeart, 300);
};

function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    // Mix of different heart colors for variety
    const colors = ["💖", "💗", "💓", "❤️"];
    heart.innerHTML = colors[Math.floor(Math.random() * colors.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 2 + 3 + "s";
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 5000);
}

// This function moves the "No" button and grows the "Yes" button
const escape = (e) => {
    // Prevent zooming/default behavior on phones
    if(e.type === "touchstart") e.preventDefault(); 
    
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;

    noBtn.style.position = "fixed";
    noBtn.style.left = Math.floor(Math.random() * maxX) + "px";
    noBtn.style.top = Math.floor(Math.random() * maxY) + "px";

    // Make "Yes" bigger every time they try to hit "No"
    scale += 0.15;
    yesBtn.style.transform = `scale(${scale})`;
};

// Works for PC (mouseover) and Phones (touchstart)
noBtn.addEventListener("mouseover", escape);
noBtn.addEventListener("touchstart", escape);

createTiles();
shuffle();