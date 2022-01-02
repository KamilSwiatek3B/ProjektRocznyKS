const vision = document.querySelector('.objective');
const startBtn = document.querySelector('.start');
const score = document.querySelector('.score');
const score2 = document.querySelector('.score2');

const pool = ['1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
let timeStart = [];     //collects each time when new goal set
let timeEnd = [];       //collects each time when succesfully typed goal
let timePoints = [];    //collects each timeframe for succesfully hitting goal
let average = 0;        //average time from timePoints array
let count=0;            //the 1 2 3 countdown at the start of each game
const counText = ['Ready?', 'Set!', 'GO!!']; //the 1 2 3 countdown at the start of each game
let idInterval;         //exists so interval in init() works
let gameStarted = false;//if flase, game do not read keystrokes
let initFlagJam = true;//protects game from starting more than one round

let logged = false;

//checks if user is logged in and sets a flag variable
const checkLogins = function () {
    if (document.cookie == '') {
        logged = false;
        console.log(logged);
    } else {
        logged = true;
        console.log(logged);
    };
};
checkLogins();

//sends score to servere
async function sendScore(avg){
    if(logged){
        let usernameCut = document.cookie.substring(10).length;
        data={
            game: "fastKey",
            score: average,
            us: document.cookie.substring(10).substring(usernameCut-1,0)
        };
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        const response = await fetch('/score', options);
        const validation = await response.json();
    }
}

//function picking random number and assigning key for it from pool[]
const pickPool = function(){
    let realRand = Math.round(Math.random()*100+1);
    if(realRand>36 && realRand<=72){
        realRand-=36;
    }else if(realRand>36 && realRand>72){
        realRand-=72;
    }
    return pool[realRand-1];
}

//reads keystrokes and ends game when correct 10times
const body = document.getElementsByTagName('body')[0].onkeyup = (e) =>{
    let ev = e;
    if(gameStarted && ev.key==vision.innerHTML){
        timeEnd.push(Date.now());
        if(timeEnd.length==10){
            gameStarted=false;
            console.log(counTime());
            score.innerHTML=timePoints+"ms";
            score2.innerHTML="average "+average+"ms";
            timePoints=[];      //reset
            sendScore(average);
            average = 0;        //reset
        }
        changeGoal();
    }
}

//counts time points
function counTime(){
    for(let i =0;i<10;i++){
        timePoints[i]=timeEnd[i]-timeStart[i];
    }
    for(let i =0;i<10;i++){
        average += timePoints[i];
    }
    average = Math.round(average/=10);
    return timePoints, average;
}

//changes goal using pickPool
function changeGoal(){
    let goal = pickPool();
    vision.innerHTML=goal;
    timeStart.push(Date.now()); 
}

//countdown before game starts
function init(){
    if(initFlagJam){
        initFlagJam = false;
        timeStart=[];       //reset
        timeEnd=[];         //reset
        gameStarted = false;
        idInterval = setInterval(countDown, 1000);
    }
}
function countDown(){
    count++;
    vision.style.color="red";
    vision.innerHTML=counText[count-1];
    if(count>3){
        vision.style.color="black";
        stop();
        gameStarted=true;
        changeGoal();
    }
}
function stop(){
    clearInterval(idInterval);
    count=0;
    initFlagJam = true;
}

//runs entire machine of functions so game progress C:
startBtn.addEventListener('click', init);