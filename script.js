// ======================
// 星空背景 + 結果頁特效
// ======================

let stars = [];

let state = "landing";

let currentQuestion = 0;

let resultPlanet = "";
let planetColor;
let traitText = "";

let orbitAngle = 0;
let particles = [];

let scores = {
    dream: 0,
    adventure: 0,
    mystery: 0,
    harmony: 0
};

const questions = [

{
    question:"假日你喜歡？",
    a:"待在家看書",
    b:"出門冒險",
    typeA:"dream",
    typeB:"adventure"
},

{
    question:"面對問題時？",
    a:"先分析",
    b:"直接嘗試",
    typeA:"dream",
    typeB:"adventure"
},

{
    question:"你更喜歡？",
    a:"獨處",
    b:"社交",
    typeA:"mystery",
    typeB:"harmony"
},

{
    question:"生活節奏偏向？",
    a:"慢慢規劃",
    b:"想到就做",
    typeA:"dream",
    typeB:"adventure"
},

{
    question:"你比較相信？",
    a:"直覺",
    b:"合作",
    typeA:"mystery",
    typeB:"harmony"
},

{
    question:"理想旅行是？",
    a:"森林秘境",
    b:"熱鬧城市",
    typeA:"mystery",
    typeB:"adventure"
},

{
    question:"你最重視？",
    a:"內心平靜",
    b:"人際關係",
    typeA:"dream",
    typeB:"harmony"
},

{
    question:"你希望成為？",
    a:"探索者",
    b:"守護者",
    typeA:"mystery",
    typeB:"harmony"
}

];

// ======================
// P5 Setup
// ======================

function setup() {

    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < 250; i++) {

        stars.push({
            x: random(width),
            y: random(height),
            size: random(1, 4),
            speed: random(0.2, 1)
        });

    }

}

function draw() {

    drawSpaceBackground();

    drawStars();

    if (state === "result") {

        drawPlanet();

        drawOrbit();

        drawParticles();

    }

}

// ======================
// 宇宙漸層背景
// ======================

function drawSpaceBackground() {

    for (let y = 0; y < height; y++) {

        let inter = map(y, 0, height, 0, 1);

        let c = lerpColor(
            color(5, 8, 25),
            color(25, 10, 45),
            inter
        );

        stroke(c);
        line(0, y, width, y);
    }

}

// ======================
// 星空
// ======================

function drawStars() {

    noStroke();

    for (let s of stars) {

        fill(255, 255, 255, random(180, 255));

        circle(s.x, s.y, s.size);

        s.y += s.speed;

        if (s.y > height) {

            s.y = 0;
            s.x = random(width);

        }

    }

}

// ======================
// 發光星球
// ======================

function drawPlanet() {

    push();

    translate(width / 2, height / 2);

    rotate(frameCount * 0.003);

    drawingContext.shadowBlur = 80;
    drawingContext.shadowColor = planetColor;

    noStroke();

    fill(planetColor);

    ellipse(0, 0, 260);

    fill(255, 60);
    ellipse(-50, -45, 90);

    fill(255, 40);
    ellipse(30, 20, 45);

    fill(255, 30);
    ellipse(-10, 60, 30);

    pop();

}

// ======================
// 光環與衛星
// ======================

function drawOrbit() {

    push();

    translate(width / 2, height / 2);

    rotate(orbitAngle);

    noFill();

    stroke(255, 120);

    strokeWeight(2);

    ellipse(0, 0, 340, 140);

    let x = cos(orbitAngle) * 170;
    let y = sin(orbitAngle) * 70;

    noStroke();

    fill(255);

    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "white";

    circle(x, y, 18);

    orbitAngle += 0.01;

    pop();

}

// ======================
// 粒子效果
// ======================

function drawParticles() {

    for (let p of particles) {

        fill(
            red(planetColor),
            green(planetColor),
            blue(planetColor),
            p.alpha
        );

        noStroke();

        circle(
            p.x,
            p.y,
            p.size
        );

        p.y -= p.speed;

        p.alpha -= 2;

    }

    particles =
        particles.filter(p => p.alpha > 0);

    if (frameCount % 3 === 0) {

        particles.push({

            x: width / 2 + random(-130, 130),

            y: height / 2 + random(-130, 130),

            size: random(3, 8),

            alpha: 255,

            speed: random(0.5, 2)

        });

    }

}

function windowResized() {

    resizeCanvas(
        windowWidth,
        windowHeight
    );

}

// ======================
// DOM Elements
// ======================

const landing =
document.getElementById("landing");

const quiz =
document.getElementById("quiz");

const result =
document.getElementById("result");

const startBtn =
document.getElementById("startBtn");

const restartBtn =
document.getElementById("restartBtn");

const questionNumber =
document.getElementById("questionNumber");

const questionText =
document.getElementById("questionText");

const choiceA =
document.getElementById("choiceA");

const choiceB =
document.getElementById("choiceB");

const planetName =
document.getElementById("planetName");

const planetDescription =
document.getElementById("planetDescription");

// ======================
// 開始測驗
// ======================

startBtn.addEventListener("click", () => {

    state = "quiz";

    landing.classList.add("hidden");

    quiz.classList.remove("hidden");

    showQuestion();

});

// ======================
// 題目顯示
// ======================

function showQuestion() {

    const q =
    questions[currentQuestion];

    questionNumber.innerText =
        `問題 ${currentQuestion + 1} / ${questions.length}`;

    questionText.innerText =
        q.question;

    choiceA.innerText = q.a;
    choiceB.innerText = q.b;

    choiceA.onclick =
        () => answer(q.typeA);

    choiceB.onclick =
        () => answer(q.typeB);

}

// ======================
// 回答
// ======================

function answer(type) {

    scores[type]++;

    currentQuestion++;

    if (
        currentQuestion >=
        questions.length
    ) {

        showResult();

    } else {

        showQuestion();

    }

}

// ======================
// 顯示結果
// ======================

function showResult() {

    state = "result";

    quiz.classList.add("hidden");

    result.classList.remove("hidden");

    let winner =
        Object.keys(scores).reduce((a, b) =>
            scores[a] > scores[b] ? a : b
        );

    switch (winner) {

        case "dream":

            resultPlanet =
                "🌙 DREAM PLANET";

            traitText =
                "Calm • Creative • Thoughtful";

            planetColor =
                color(100, 180, 255);

            break;

        case "adventure":

            resultPlanet =
                "🔥 ADVENTURE PLANET";

            traitText =
                "Brave • Energetic • Curious";

            planetColor =
                color(255, 140, 50);

            break;

        case "mystery":

            resultPlanet =
                "🔮 MYSTERY PLANET";

            traitText =
                "Imaginative • Unique • Explorer";

            planetColor =
                color(180, 100, 255);

            break;

        case "harmony":

            resultPlanet =
                "🌿 HARMONY PLANET";

            traitText =
                "Warm • Balanced • Connected";

            planetColor =
                color(0, 220, 150);

            break;

    }

    planetName.innerHTML =
    `
    YOUR DIGITAL PLANET
    <br><br>
    ${resultPlanet}
    `;

    planetDescription.innerHTML =
        traitText;

}

// ======================
// 重新測驗
// ======================

restartBtn.addEventListener("click", () => {

    state = "landing";

    currentQuestion = 0;

    orbitAngle = 0;

    particles = [];

    scores = {

        dream: 0,

        adventure: 0,

        mystery: 0,

        harmony: 0

    };

    result.classList.add("hidden");

    landing.classList.remove("hidden");

});