// ======================
// 星空背景
// ======================

let stars = [];

let state = "landing";

let currentQuestion = 0;

let resultPlanet = "";

let scores = {
    dream:0,
    adventure:0,
    mystery:0,
    harmony:0
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

function setup(){

    createCanvas(windowWidth, windowHeight);

    for(let i=0;i<200;i++){

        stars.push({
            x:random(width),
            y:random(height),
            size:random(1,4),
            speed:random(0.2,1)
        });

    }

}

function draw(){

    background(5,8,25);

    drawStars();

    if(state === "result"){
        drawPlanet();
    }

}

function drawStars(){

    fill(255);
    noStroke();

    for(let s of stars){

        circle(s.x,s.y,s.size);

        s.y += s.speed;

        if(s.y > height){
            s.y = 0;
            s.x = random(width);
        }

    }

}

function drawPlanet(){

    push();

    translate(width/2,height/2);

    rotate(frameCount * 0.005);

    noStroke();

    switch(resultPlanet){

        case "Dream Planet":
            fill(80,150,255);
            break;

        case "Adventure Planet":
            fill(255,140,0);
            break;

        case "Mystery Planet":
            fill(180,80,255);
            break;

        case "Harmony Planet":
            fill(0,220,140);
            break;
    }

    ellipse(0,0,250);

    fill(255,60);
    ellipse(35,-35,60);

    pop();

}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

// ======================
// DOM
// ======================

const landing = document.getElementById("landing");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

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

startBtn.addEventListener("click",()=>{

    state = "quiz";

    landing.classList.add("hidden");
    quiz.classList.remove("hidden");

    showQuestion();

});

// ======================
// 題目顯示
// ======================

function showQuestion(){

    const q = questions[currentQuestion];

    questionNumber.innerText =
    `問題 ${currentQuestion+1} / ${questions.length}`;

    questionText.innerText =
    q.question;

    choiceA.innerText = q.a;
    choiceB.innerText = q.b;

    choiceA.onclick = () => answer(q.typeA);
    choiceB.onclick = () => answer(q.typeB);

}

// ======================
// 回答
// ======================

function answer(type){

    scores[type]++;

    currentQuestion++;

    if(currentQuestion >= questions.length){

        showResult();

    }else{

        showQuestion();

    }

}

// ======================
// 顯示結果
// ======================

function showResult(){

    state = "result";

    quiz.classList.add("hidden");
    result.classList.remove("hidden");

    let winner =
    Object.keys(scores).reduce((a,b)=>
        scores[a] > scores[b] ? a : b
    );

    switch(winner){

        case "dream":

            resultPlanet = "Dream Planet";

            planetDescription.innerText =
            "你是一位冷靜、富有創造力的思考者。";

            break;

        case "adventure":

            resultPlanet = "Adventure Planet";

            planetDescription.innerText =
            "你喜歡挑戰與探索，充滿行動力。";

            break;

        case "mystery":

            resultPlanet = "Mystery Planet";

            planetDescription.innerText =
            "你熱愛未知與發現，充滿想像力。";

            break;

        case "harmony":

            resultPlanet = "Harmony Planet";

            planetDescription.innerText =
            "你重視平衡與連結，是溫暖的存在。";

            break;
    }

    planetName.innerText = resultPlanet;

}

// ======================
// 重新測驗
// ======================

restartBtn.addEventListener("click",()=>{

    state = "landing";

    currentQuestion = 0;

    scores = {
        dream:0,
        adventure:0,
        mystery:0,
        harmony:0
    };

    result.classList.add("hidden");
    landing.classList.remove("hidden");

});