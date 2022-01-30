const games = [
    aimer = document.querySelector('.aimer'),
    spamer = document.querySelector('.spamer'),
    fastKey = document.querySelector('.fastKey'),
    boxxer = document.querySelector('.boxxer')
]

async function getBests() {
    const response = await fetch('/score');
    const data = await response.json();
    return data.data;
}

let so = getBests().then((so) => {
    console.log(so);
    for(let i=0; i<games.length;i++){
        games[i].innerHTML=`<p class="game">game: ${so[i].game}</p><p class="score">score: ${so[i].score}</p><p class="player">player: ${so[i].username}</p>`;
    }
});