const init = document.querySelector('.init');
const user = document.querySelector('#user');
const pass = document.querySelector('#pass');
const code = document.querySelector('#code');
const stat = document.querySelector('.stat');


//Checks Input before sending request
const inputCheck = function(us, ps, cd){
    if(us.length==0)
    {
        stat.innerHTML="Username can't be null";
        return 0;
    }
    if(ps.length==0)
    {
        stat.innerHTML="Password can't be null";
        return 0;
    }
    if(ps.length>16)
    {
        stat.innerHTML="Password max length is 16";
        return 0;
    }
    if(us.length>10)
    {
        stat.innerHTML="Username max length is 10";
        return 0;
    }
    if(cd.length==0)
    {
        stat.innerHTML="Admin-Code can't be null";
        return 0;
    }
    return 1;
}


//Informs user about success or complications of request
const info = function(message){
    if(message=="occ"){
        stat.innerHTML="This username is already occupied. :C";
        return 0;
    }
    if(message=="free"){
        stat.innerHTML="Your account was created succesfully!!!";
        return 0;
    }
    if(message=="code"){
        stat.innerHTML="Wrong admin-code. Contact admin(contact below) for your code.";
        return 0;
    }
}

//send validation request to server 
init.addEventListener('click', async () => {
    if (inputCheck(user.value, pass.value, code.value)) {
        credentials = {
            us: user.value,
            ps: pass.value,
            cd: code.value
        };
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        };
        const response = await fetch('/register', options);
        const validation = await response.json();
        console.log(validation.validity);
        info(validation.validity);
    }
});
