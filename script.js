// =====================
// 星空背景 + 心理測驗 + 上一題 + 中文結果
// =====================

let stars = [];

let state = "landing";
let currentQuestion = 0;

let answerHistory = [];

let orbitAngle = 0;
let particles = [];

let resultPlanet = "";
let planetColor;
let traitText = "";

let scores = {
    dream:0,
    adventure:0,
    mystery:0,
    harmony:0
};

const questions = [
{ q:"假日你喜歡？", a:"待在家", b:"出門冒險", ta:"dream", tb:"adventure" },
{ q:"遇到問題？", a:"分析", b:"行動", ta:"dream", tb:"adventure" },
{ q:"你偏好？", a:"獨處", b:"社交", ta:"mystery", tb:"harmony" },
{ q:"節奏？", a:"慢", b:"快", ta:"dream", tb:"adventure" },
{ q:"相信？", a:"直覺", b:"合作", ta:"mystery", tb:"harmony" },
{ q:"旅行？", a:"森林", b:"城市", ta:"mystery", tb:"adventure" },
{ q:"重視？", a:"平靜", b:"關係", ta:"dream", tb:"harmony" },
{ q:"想成為？", a:"探索者", b:"守護者", ta:"mystery", tb:"harmony" }
];

// =====================
// p5.js
// =====================

function setup(){
    createCanvas(windowWidth, windowHeight);

    for(let i=0;i<200;i++){
        stars.push({
            x:random(width),
            y:random(height),
            s:random(1,3),
            sp:random(0.2,1)
        });
    }
}

function draw(){
    background(5,8,25);

    drawStars();

    if(state==="result"){
        drawPlanet();
        drawOrbit();
        drawParticles();
    }
}

// =====================
// 星空
// =====================

function drawStars(){
    noStroke();
    fill(255);

    for(let st of stars){
        circle(st.x,st.y,st.s);
        st.y += st.sp;

        if(st.y>height){
            st.y=0;
            st.x=random(width);
        }
    }
}

// =====================
// 星球（原美術保留）
// =====================

function drawPlanet(){
    push();
    translate(width/2,height/2);
    rotate(frameCount*0.003);

    drawingContext.shadowBlur = 80;
    drawingContext.shadowColor = planetColor;

    noStroke();
    fill(planetColor);

    ellipse(0,0,260);

    fill(255,50);
    ellipse(-40,-30,70);

    pop();
}

// =====================
// 軌道衛星
// =====================

function drawOrbit(){
    push();
    translate(width/2,height/2);

    noFill();
    stroke(255,120);

    rotate(orbitAngle);
    ellipse(0,0,340,140);

    let x = cos(orbitAngle)*170;
    let y = sin(orbitAngle)*70;

    noStroke();
    fill(255);
    circle(x,y,15);

    orbitAngle += 0.01;

    pop();
}

// =====================
// 粒子
// =====================

function drawParticles(){
    for(let p of particles){
        fill(red(planetColor),green(planetColor),blue(planetColor),p.a);
        noStroke();

        circle(p.x,p.y,p.s);

        p.y -= p.sp;
        p.a -= 2;
    }

    particles = particles.filter(p=>p.a>0);

    if(frameCount%4===0){
        particles.push({
            x:width/2+random(-100,100),
            y:height/2+random(-100,100),
            s:random(3,7),
            a:255,
            sp:random(0.5,2)
        });
    }
}

// =====================
// UI 元件
// =====================

const landing=document.getElementById("landing");
const quiz=document.getElementById("quiz");
const result=document.getElementById("result");

const startBtn=document.getElementById("startBtn");
const restartBtn=document.getElementById("restartBtn");
const backBtn=document.getElementById("backBtn");

const qNum=document.getElementById("questionNumber");
const qText=document.getElementById("questionText");
const aBtn=document.getElementById("choiceA");
const bBtn=document.getElementById("choiceB");

const pName=document.getElementById("planetName");
const pDesc=document.getElementById("planetDescription");

// =====================
// 開始
// =====================

startBtn.onclick=()=>{
    state="quiz";
    landing.classList.add("hidden");
    quiz.classList.remove("hidden");
    showQ();
};

// =====================
// 顯示題目
// =====================

function showQ(){
    let q=questions[currentQuestion];

    qNum.textContent=`Q${currentQuestion+1}/8`;
    qText.textContent=q.q;

    aBtn.textContent=q.a;
    bBtn.textContent=q.b;

    aBtn.onclick=()=>answer(q.ta);
    bBtn.onclick=()=>answer(q.tb);

    backBtn.style.display = currentQuestion===0 ? "none":"inline-block";
}

// =====================
// 回答
// =====================

function answer(type){
    answerHistory.push(type);
    scores[type]++;
    currentQuestion++;

    if(currentQuestion>=questions.length){
        showResult();
    }else{
        showQ();
    }
}

// =====================
// 上一題
// =====================

backBtn.onclick=()=>{
    if(currentQuestion===0) return;

    currentQuestion--;

    let last = answerHistory.pop();
    scores[last]--;

    showQ();
};

// =====================
// 結果（中文化）
// =====================

function showResult(){
    state="result";

    quiz.classList.add("hidden");
    result.classList.remove("hidden");

    let w = Object.keys(scores).reduce((a,b)=>
        scores[a]>scores[b]?a:b
    );

    let cnTitle = "";
    let cnDesc = "";

    if(w==="dream"){
        resultPlanet="🌙 夢境星球";
        planetColor=color(100,180,255);

        cnTitle="夢境星球";
        cnDesc="冷靜、富有創造力、思考型人格";
    }

    if(w==="adventure"){
        resultPlanet="🔥 冒險星球";
        planetColor=color(255,140,60);

        cnTitle="冒險星球";
        cnDesc="勇敢、行動力強、熱愛探索";
    }

    if(w==="mystery"){
        resultPlanet="🔮 神秘星球";
        planetColor=color(180,100,255);

        cnTitle="神秘星球";
        cnDesc="想像力豐富、喜歡未知與探索";
    }

    if(w==="harmony"){
        resultPlanet="🌿 和諧星球";
        planetColor=color(0,220,160);

        cnTitle="和諧星球";
        cnDesc="溫暖、平衡、重視人際關係";
    }

    pName.textContent = cnTitle;
    pDesc.textContent = cnDesc;
}

// =====================
// 重置
// =====================

restartBtn.onclick=()=>{
    state="landing";
    currentQuestion=0;
    answerHistory=[];
    orbitAngle=0;
    particles=[];

    scores={
        dream:0,
        adventure:0,
        mystery:0,
        harmony:0
    };

    result.classList.add("hidden");
    landing.classList.remove("hidden");
};