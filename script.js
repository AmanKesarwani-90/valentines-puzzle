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
    // Clear the container and show the centered message box with your lines
    document.querySelector('.container').innerHTML = `
        <div style="
            background: rgba(255, 255, 255, 0.98); 
            padding: 50px 40px; 
            border-radius: 24px; 
            box-shadow: 0 20px 45px rgba(0,0,0,0.15); 
            z-index: 10; 
            position: relative;
            max-width: 90%;
            text-align: center;
            animation: fadeIn 1.5s ease-in-out;">
            
            <p style="font-family: 'Georgia', serif; font-size: 1.3em; color: #444; font-style: italic; line-height: 1.6; margin-bottom: 25px;">
                "In every version of my life, <br>
                I would always find my way to you."
            </p>

            <div style="width: 50px; height: 2px; background: #ff5c8d; margin: 0 auto 25px auto; opacity: 0.5;"></div>

            <h1 style="color: #ff5c8d; font-family: 'Helvetica', sans-serif; font-size: 1.8em; margin: 0; font-weight: bold; letter-spacing: 1px;">
                Happy Valentine’s Eve, love.
            </h1>
        </div>
    `;

    // Start the heavy heart rain
    setInterval(createHeart, 150);
};

function createHeart() {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.style.position = "fixed";
    heart.style.top = "-60px"; 
    heart.style.left = Math.random() * 100 + "vw";
    
    // Keeping them BIG as requested
    heart.style.fontSize = (Math.random() * 30 + 35) + "px"; 
    
    heart.style.color = "#ff5c8d";
    heart.style.userSelect = "none";
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "1"; 
    
    const duration = Math.random() * 3 + 2.5; 
    heart.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-in`;
    
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.style.transform = `translateY(115vh) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = "0";
    }, 100);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
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