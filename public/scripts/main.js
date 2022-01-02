const btn = document.querySelector('.CountBtn');
let counter = 0;
const ShopCheck = async function () {
    const response = await fetch('/shop');
    const data = await response.json();
    console.log(data.votes);
    btn.innerHTML=data.votes;
};

btn.onload = ShopCheck();

btn.addEventListener('click', async () => {
    if (logged) {
            counter++;
            btn.innerHTML=parseInt(btn.innerHTML)+1;
        }
    });
    btn.addEventListener('focusout', async () => {
        if (logged) {
            Credentials = {
                inc: counter
            };
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Credentials)
            };
            const inc = await fetch('/shop', options);
            const incrementation = await inc.json();
            console.log(incrementation.status);
            counter=0;
    }
});