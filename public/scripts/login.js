const username = document.querySelector('#name');
const password = document.querySelector('#pass');
const btn = document.querySelector('#btn');
const logOut = document.querySelector('.logOut');
const loGuide = document.querySelector('.logGuide');

let logged = false;
let credentials;

//checks if user is logged in and sets a flag variable
const checkLogins = function () {
    if (document.cookie == '') {
        logged = false;
        console.log(logged);
        logOut.style.display = "none";
    } else {
        logged = true;
        console.log(logged);
        console.log(`logged as ${document.cookie}`);
        logOut.style.display = "block";
        loGuide.innerHTML = `logged as ${document.cookie.substring(9)}`;
    };
};

//message after invalid credentials
const invalid = function () {
    loGuide.innerHTML = "Invalid credentials! Re-enter password or username(or both)";
}

//Setting cookies after logging in
const valid = function (name) {
    let date = new Date();
    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000)); //1day expiration time
    let time = date.toUTCString();
    document.cookie = `username=${name}; expires=` + time + ";";
    console.log(document.cookie);
    checkLogins();
};

//Checks Input before sending request
const inputCheck = function(us, ps){
    if(us.length==0)
    {
        loGuide.innerHTML="Username can't be null";
        return 0;
    }
    if(ps.length==0)
    {
        loGuide.innerHTML="Password can't be null";
        return 0;
    }
    if(ps.length>16)
    {
        loGuide.innerHTML="Password max length is 16";
        return 0;
    }
    if(us.length>10)
    {
        loGuide.innerHTML="Username max length is 10";
        return 0;
    }
    return 1;
}

//Logs Off. Deleting cookies and restarting button.
logOut.addEventListener('click', () => {
    let cookie = document.cookie;
    console.log(cookie);
    document.cookie = cookie + '; expires=Jan 1, 1970, 00:00:00.000 GMT;';
    checkLogins();
    loGuide.innerHTML = '';
})

//send validation request to server 
btn.addEventListener('click', async () => {
    if (inputCheck(username.value, password.value)) {
        credentials = {
            us: username.value,
            ps: password.value
        };
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        };
        const response = await fetch('/index', options);
        const validation = await response.json();
        if (validation.validation === 'true') {
            valid(validation.username);
        } else {
            invalid();
        }
    }
});

checkLogins();