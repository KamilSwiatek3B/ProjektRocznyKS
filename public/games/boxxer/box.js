const boxer = document.querySelector('#boxxer');
const line = document.querySelector('#line');
const bag = document.querySelector('#bag');
const info = document.querySelector('#info');

//music
const audio = new Audio('media/kapchiptune.ogg');
const Play = document.querySelector('#Play');
const Pause = document.querySelector('#Pause');
audio.loop=true;
Play.addEventListener('click',()=>{
    audio.play();
})
Pause.addEventListener('click',()=>{
    audio.pause();
})
// audio.currentTime=0;
audio.volume=0.3;
// audio.volume=1.0;

//game mechanics
const speed = 2; // the lower the slower (max is 99, but just don't)

function punch(points){
    boxer.classList.toggle("stand");
    bag.style.marginLeft=`${points}px`;
    boxer.classList.toggle("punch");
    setTimeout(() => {
        boxer.classList.toggle("punch");
        bag.style.marginLeft="0px";
        boxer.classList.toggle("stand");
        setTimeout(()=> {
            line.style.width="10px";
        }, 250);
    }, 250)
}

function display(points, type){
    if(type=="Miss") info.innerHTML="Miss!!";
    if(type=="Crit") info.innerHTML="<b>CRIT!<br>175!!!</b>";
    if(type=="None") info.innerHTML=`${points}!`;
    info.style.display="block";
        setTimeout(() => {
        info.innerHTML="";
        info.style.display="none";
    }, 1000);
}

function start(){
    let counter = 0;
    window.addEventListener('keydown', function oke(e){
        if(e.key == "x"){
            clearInterval(i);
            stop(parseInt(line.style.width));
        }
        window.removeEventListener('keydown', oke);
    })
    let i = setInterval(function(){
        line.style.width=`${counter}%`
        counter += speed; //speed is 2

        if(counter >= 100) {
            clearInterval(i);
            stop("Miss!"); 
        }
    }, 10);
}

function stop(points){
    if(points=="10px") return; // blocks callback from {counter>=100} statement
    if(points>50) points = (points - 100)*-1; // shrinks points if on right side from center
    if(points=="Miss!" || points<=16){
        display(points, "Miss");
        setTimeout(()=> {
            line.style.width="10px";
        }, 500);
        return;
    }
    if(points==50){
        points*=3;
        points+=25; //boost for center
        display(points, "Crit");
        punch(points);
        return;
    }
    points*=3;
    display(points, "None");
    punch(points);
}

window.addEventListener('keydown', (e) => {
    if(e.key == "c"){
        start();
    }
})