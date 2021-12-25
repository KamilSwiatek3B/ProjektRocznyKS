//i realised too late that i should have managed all the
// money counting on the server. Not giving users control
// over their cash.
const loginStatus = document.querySelector('.login-status');
const dailyGet = document.querySelector('.daily');
const dailyFeed = document.querySelector('.dailyFeed');

let usernameCut = document.cookie.substring(10).length;
let us = document.cookie.substring(10).substring(usernameCut - 1, 0);
if(us!==""){
    loginStatus.innerHTML = "Logged as: " + us;
}else{
    loginStatus.innerHTML = "Logged as: NONE";
}
console.log('T');

async function sendScore(konto){
    if(document.cookie!=''){
        console.log('sending!!!!!!!!!!!!!');
        let usernameCut = document.cookie.substring(10).length;
        data={
            game: "Roulette",
            score: konto,
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

async function updateMoney(konto) {
    sendScore(konto);
    let usernameCut = document.cookie.substring(10).length;
    us = document.cookie.substring(10).substring(usernameCut - 1, 0);
    credentials = {
        us: us,
        konto: konto
    };
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    };

    const response = await fetch('/updateMoney', options);
    // const data = await response.json().then((data) =>{
    //     konto = data.status;
    // });
}

async function getMoney() {
    let usernameCut = document.cookie.substring(10).length;
    us = document.cookie.substring(10).substring(usernameCut - 1, 0);
    credentials = {
        us: us
    };
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    };

    const response = await fetch('/getMoney', options);
    const data = await response.json().then((data) => {
        konto = data.status;
    });
    saldo.innerHTML = `Balance: ${konto}`;

    // return data.money;
}

dailyGet.addEventListener('click', async ()=> {
    let usernameCut = document.cookie.substring(10).length;
    us = document.cookie.substring(10).substring(usernameCut - 1, 0);
    credentials = {
        us: us,
        flag: true
    };
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    };

    const response = await fetch('/getMoney', options);
    const data = await response.json().then((data) => {
        if(data.status==true){
            konto += 100;
            dailyFeed.innerHTML="Gathered!";
        }else{
            console.log(data.status);
            dailyFeed.innerHTML="Daily already gathered <b>Wait till midnight</b>";
        }
    });
    saldo.innerHTML = `Balance: ${konto}`;
    updateMoney(konto);
})


//!!! ---> This code is not maintained well and poor written, as i was learning js basics at the time <--- !!!

const gold = [0, 1, 2, 3, 4, 5, 6];
const blue = [7, 8, 9, 10, 11, 12, 31, 32, 33, 34, 35, 36, 55, 56, 57, 58, 59, 60, 91, 92, 93, 94, 95, 96, 139, 140, 141, 142, 143, 144, 187, 188, 189, 190, 191, 192, 235, 236, 237, 238, 239, 240, 259, 260, 261, 262, 263, 264, 283, 284, 285, 286, 287, 288, 331, 332, 333, 334, 335, 336, 355, 356, 357, 358, 359, 360]
const red = [19, 20, 21, 22, 23, 24, 43, 44, 45, 46, 47, 48, 67, 68, 69, 70, 71, 72, 79, 80, 81, 82, 83, 84, 103, 104, 105, 106, 107, 108, 115, 116, 117, 118, 119, 120, 127, 128, 129, 130, 131, 132, 151, 152, 153, 154, 155, 156, 163, 164, 165, 166, 167, 168, 175, 176, 177, 178, 179, 180, 199, 200, 201, 202, 203, 204, 211, 212, 213, 214, 215, 216, 223, 224, 225, 226, 227, 228, 247, 248, 249, 250, 251, 252, 271, 272, 273, 274, 275, 276, 295, 296, 297, 298, 299, 300, 307, 308, 309, 310, 311, 312, 319, 320, 321, 322, 323, 324, 343, 344, 345, 346, 347, 348]
const grey = [13, 14, 15, 16, 17, 18, 25, 26, 27, 28, 29, 30, 37, 38, 39, 40, 41, 42, 49, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 66, 73, 74, 75, 76, 77, 78, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 109, 110, 111, 112, 113, 114, 121, 122, 123, 124, 125, 126, 133, 134, 135, 136, 137, 138, 145, 146, 147, 148, 149, 150, 157, 158, 159, 160, 161, 162, 169, 170, 171, 172, 173, 174, 181, 182, 183, 184, 185, 186, 193, 194, 195, 196, 197, 198, 205, 206, 207, 208, 209, 210, 217, 218, 219, 220, 221, 222, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 253, 254, 255, 256, 257, 258, 265, 266, 267, 268, 269, 270, 277, 278, 279, 280, 281, 282, 289, 290, 291, 292, 293, 294, 301, 302, 303, 304, 305, 306, 313, 314, 315, 316, 317, 318, 325, 326, 327, 328, 329, 330, 337, 338, 339, 340, 341, 342, 349, 350, 351, 352, 353, 354]

const history = [];

/*przyciski dodające bet */
const p10 = document.querySelector('.p10');
const p100 = document.querySelector('.p100');
const p1k = document.querySelector('.p1k');
const p10k = document.querySelector('.p10k');
/*przyciski odejmujące bet */
const p_10 = document.querySelector('.p_10');
const p_100 = document.querySelector('.p_100');
const p_1k = document.querySelector('.p_1k');
const p_10k = document.querySelector('.p_10k');

// const btn = document.querySelector('.spin');
const tar = document.querySelector('.tar');
const saldo = document.querySelector('.saldo');
const input = document.querySelector('.input');

/* przyciski wybierające bet*/
const x2 = document.querySelector('.bet2')
const x3 = document.querySelector('.bet3')
const x5 = document.querySelector('.bet5')
const x50 = document.querySelector('.bet50')
const reset = document.querySelector('.reset')

/* suma betów */
const sum2 = document.querySelector('.sum2')
const sum3 = document.querySelector('.sum3')
const sum5 = document.querySelector('.sum5')
const sum50 = document.querySelector('.sum50')

/* historia */
const h1 = document.querySelector('.h1');
const h2 = document.querySelector('.h2');
const h3 = document.querySelector('.h3');
const h4 = document.querySelector('.h4');
const h5 = document.querySelector('.h5');
const h6 = document.querySelector('.h6');
const h7 = document.querySelector('.h7');
const h8 = document.querySelector('.h8');
const h9 = document.querySelector('.h9');
const h10 = document.querySelector('.h10');

const greyCount = document.querySelector('.greyCount');
const redCount = document.querySelector('.redCount');
const blueCount = document.querySelector('.blueCount');
const goldCount = document.querySelector('.goldCount');
let gCnt = 0,
    rCnt = 0,
    bCnt = 0,
    goldCnt = 0;
greyCount.innerHTML = `Grey: ${gCnt}`;
redCount.innerHTML = `Red: ${rCnt}`;
blueCount.innerHTML = `Blue: ${bCnt}`;
goldCount.innerHTML = `Gold: ${goldCnt}`;
//saldo.innerHTML = `Balance: ${konto}`;
let obrot = 0;
let loss = 0;
let konto = 1000;

saldo.innerHTML = `Balance: ${konto}`;


tar.addEventListener('click', (e) => {
    loss = Math.floor(Math.random() * 360);
    tar.style.transition = 3 + 's';
    obrot += 2880;
    obrot += loss;
    tar.style.transform = `rotate(${obrot}deg)`;
    // btn.style.transform = `rotate(${obrot}deg)`;

    console.log(loss);

    x2.disabled = true;
    x3.disabled = true;
    x5.disabled = true;
    x50.disabled = true;

    p10.disabled = true;
    p100.disabled = true;
    p1k.disabled = true;
    p10k.disabled = true;

    p_10.disabled = true;
    p_100.disabled = true;
    p_1k.disabled = true;
    p_10k.disabled = true;

    reset.disabled = true;

    tar.style.pointerEvents = 'none';


    setTimeout(() => {

        if (grey.includes(loss)) {
            console.log('winG');
            konto += 2 * su2;
            saldo.innerHTML = `Balance: ${konto}`;
            lstClr = 1;
            history.push('var(--grey)');
            gCnt++;
            greyCount.innerHTML = `Grey: ${gCnt}`;
            //h1.style.backgroundColor = 'var(--grey)';
        }
        if (red.includes(loss)) {
            console.log('winR');
            konto += 3 * su3;
            saldo.innerHTML = `Balance: ${konto}`;
            history.push('var(--red)');
            rCnt++;
            redCount.innerHTML = `Red: ${rCnt}`;
            //h1.style.backgroundColor = 'var(--red)';
        }
        if (blue.includes(loss)) {
            console.log('winB');
            konto += 5 * su5;
            saldo.innerHTML = `Balance: ${konto}`;
            history.push('var(--blue)');
            bCnt++;
            blueCount.innerHTML = `Blue: ${bCnt}`;
            //h1.style.backgroundColor = 'var(--blue)';
        }
        if (gold.includes(loss)) {
            console.log('winGOLD');
            konto += 50 * su50;
            saldo.innerHTML = `Balance:${konto}`;
            history.push('var(--gold)');
            goldCnt++;
            goldCount.innerHTML = `Gold: ${goldCnt}`;
            //h1.style.backgroundColor = 'var(--gold)';
        }
        his();
        updateMoney(konto);
        setTimeout(() => {
            su2 = 0;
            su3 = 0;
            su5 = 0;
            su50 = 0;
            sum2.innerHTML = 0;
            sum3.innerHTML = 0;
            sum5.innerHTML = 0;
            sum50.innerHTML = 0;
            tar.style.transition = .5 + 's';
            tar.style.transform = `rotate(0deg)`;
            // btn.style.transform = `rotate(0deg)`;
            tar.style.pointerEvents = 'all';
            x2.disabled = false;
            x3.disabled = false;
            x5.disabled = false;
            x50.disabled = false;

            p10.disabled = false;
            p100.disabled = false;
            p1k.disabled = false;
            p10k.disabled = false;

            p_10.disabled = false;
            p_100.disabled = false;
            p_1k.disabled = false;
            p_10k.disabled = false;

            reset.disabled = false;
            obrot = 0;
        }, 3000);

    }, 3000);

});
let su2 = 0;
let su3 = 0;
let su5 = 0;
let su50 = 0;
let gwarancja = 0;
input.value = 0;


x2.addEventListener('click', () => {
    if (input.value <= konto && input.value >= 0) {
        konto -= input.value;
        saldo.innerHTML = `Balance: ${konto}`;
        su2 += parseInt(input.value, 10);
        sum2.innerHTML = su2;
    } else {
        alert("Not enough money\n Cannot bet negative amount");
    }
});

x3.addEventListener('click', () => {
    if (input.value <= konto && input.value >= 0) {
        konto -= input.value;
        saldo.innerHTML = `Balance: ${konto}`;
        su3 += parseInt(input.value, 10);
        sum3.innerHTML = su3;
    } else {
        alert("Not enough money\n Cannot bet negative amount");
    }
});

x5.addEventListener('click', () => {
    if (input.value <= konto && input.value >= 0) {
        konto -= input.value;
        saldo.innerHTML = `Balance: ${konto}`;
        su5 += parseInt(input.value, 10);
        sum5.innerHTML = su5;
    } else {
        alert("Not enough money\n Cannot bet negative amount");
    }
});

x50.addEventListener('click', () => {
    if (input.value <= konto && input.value >= 0) {
        konto -= input.value;
        saldo.innerHTML = `Balance: ${konto}`;
        su50 += parseInt(input.value, 10);
        sum50.innerHTML = su50;
    } else {
        alert("Not enough money\n Cannot bet negative amount");
    }
});

let szypko = 0;

p10.addEventListener('click', () => {
    szypko = parseInt(input.value, 10);
    szypko += 10;
    input.value = szypko;
});
p100.addEventListener('click', () => {
    szypko = parseInt(input.value, 10);
    szypko += 100;
    input.value = szypko;
});
p1k.addEventListener('click', () => {
    szypko = parseInt(input.value, 10);
    szypko += 1000;
    input.value = szypko;
});
p10k.addEventListener('click', () => {
    szypko = parseInt(input.value, 10);
    szypko += 10000;
    input.value = szypko;
});

p_10.addEventListener('click', () => {
    szypko = parseInt(input.value, 10);
    szypko -= 10;
    input.value = szypko;
});
p_100.addEventListener('click', () => {
    szypko = parseInt(input.value, 10);
    szypko -= 100;
    input.value = szypko;
});
p_1k.addEventListener('click', () => {
    szypko = parseInt(input.value, 10);
    szypko -= 1000;
    input.value = szypko;
});
p_10k.addEventListener('click', () => {
    szypko = parseInt(input.value, 10);
    szypko -= 10000;
    input.value = szypko;
});
reset.addEventListener('click', () => {
    gwarancja = su50 + su5 + su3 + su2;
    konto += gwarancja;
    input.value = 0;
    szypko = 0;
    su2 = 0;
    su3 = 0;
    su5 = 0;
    su50 = 0;

    sum2.innerHTML = 0;
    sum3.innerHTML = 0;
    sum5.innerHTML = 0;
    sum50.innerHTML = 0;
    saldo.innerHTML = `Balance: ${konto}`;
});

input.addEventListener('focus', (e) => {
    input.value = 0;
    szypko = 0;
});

function his() {
    if (history.length == 11) {
        history.shift(history[0]);
    }

    //h1.style.backgroundColor = 'var(--gold)';
    h10.style.backgroundColor = history[9];
    h9.style.backgroundColor = history[8];
    h8.style.backgroundColor = history[7];
    h7.style.backgroundColor = history[6];
    h6.style.backgroundColor = history[5];
    h5.style.backgroundColor = history[4];
    h4.style.backgroundColor = history[3];
    h3.style.backgroundColor = history[2];
    h2.style.backgroundColor = history[1];
    h1.style.backgroundColor = history[0];
}

getMoney();