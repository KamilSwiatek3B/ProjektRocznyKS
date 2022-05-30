const boxer = document.querySelector('#boxxer');
const line = document.querySelector('#line');
const bag = document.querySelector('#bag');
const info = document.querySelector('#info');
const init = document.querySelector('#init');
let RoundStarted = false; //flag blocking new round if one is started
let hits = [];


let logged = false;
//checks if user is logged in and sets a flag variable
const checkLogins = function () {
    if (document.cookie == '') {
        logged = false;
    } else {
        logged = true;
    };
};
checkLogins();

//sends score to servere
async function sendScore(average){
    if(logged){
        let usernameCut = document.cookie.substring(10).length;
        data={
            game: "Boxxer",
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


//music
const audio = new Audio('media/kapchiptune.ogg');
const Play = document.querySelector('#Play');
const Pause = document.querySelector('#Pause');
audio.loop = true;
Play.addEventListener('click', () => {
    audio.play();
})
Pause.addEventListener('click', () => {
    audio.pause();
})
// audio.currentTime=0;
audio.volume = 0.3;
// audio.volume=1.0;

//game mechanics
const speed = 2; // the lower the slower (max is 99, but just don't)

function punch(points) {
    boxer.classList.toggle("stand");
    bag.style.marginLeft = `${points}px`;
    boxer.classList.toggle("punch");
    setTimeout(() => {
        boxer.classList.toggle("punch");
        bag.style.marginLeft = "0px";
        boxer.classList.toggle("stand");
        setTimeout(() => {
            line.style.width = "10px";
        }, 250);
    }, 250)
}

//Displays amount of points/miss/criticall
function display(points, type) {
    if (type == "Miss") {
        info.innerHTML = "Miss!!";
        hits.push(0);
    }
    if (type == "Crit") {
        info.innerHTML = "<b>CRIT!<br>175!!!</b>";
        hits.push(points);
    }
    if (type == "None") {
        info.innerHTML = `${points}!`;
        hits.push(points);
    }
    info.style.display = "block";
    setTimeout(() => {
        info.innerHTML = "";
        info.style.display = "none";
        if (hits.length <= 10) {
            let TimeBetweenPunch = Math.round(Math.random() * 10 +1); //random number from 0-9 +1
            if(TimeBetweenPunch>5) TimeBetweenPunch-=4;
            setTimeout(start, TimeBetweenPunch * 1000);//TimeBetweenPunch *
        } else {
            let average = 0;
            RoundStarted = false; //false after 10 hits
            for (let i = 0; i < 10; i++) {
                average += hits[i];
            }
            average/=10;
            sendScore(average);
            info.innerHTML = `Your score on average is ${average}! One more round?`;
            info.style.display = "block";

            hits=[];

        }
    }, 1000);
}

function start() {
    let counter = 0;
    RoundStarted = true;
    function hit(e){
        if (e.key == "x") {
            clearInterval(i);
            stop(parseInt(line.style.width));
        }
        window.removeEventListener('keydown', hit);
    }
    window.addEventListener('keydown', hit);
    let i = setInterval(function () {
        line.style.width = `${counter}%`
        counter += speed; //speed is 2
        if (counter >= 100) {
            clearInterval(i);
            stop("Miss!");
            window.removeEventListener('keydown', hit);
        }
    }, 10);
}

function stop(points) {
    if (points == "10px") return; // blocks callback from {counter>=100} statement
    if (points > 50) points = (points - 100) * -1; // shrinks points if on right side from center
    if (points == "Miss!" || points <= 16) {
        display(points, "Miss");
        setTimeout(() => {
            line.style.width = "10px";
        }, 500);
        return;
    }
    if (points == 50) {
        points *= 3;
        points += 25; //boost for center
        display(points, "Crit");
        punch(points);
        return;
    }
    points *= 3;
    display(points, "None");
    punch(points);
}

// window.addEventListener('keydown', (e) => {
//     if (e.key == "c") {
//         start();
//     }
// })
init.addEventListener('click', () => {
    if (!RoundStarted){
        info.innerHTML = "";
        info.style.display = "none";
        start();
    }   
})
