const btn = document.querySelector('.CountBtn');

const ShopCheck = async function () {
    const response = await fetch('/shop');
    const data = await response.json();
    console.log(data.votes);
    btn.innerHTML=data.votes;
};

btn.onload = ShopCheck();

btn.addEventListener('click', async () => {
    if (logged) {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        };
        const inc = await fetch('/shop', options);
        const incrementation = await inc.json();
        if(incrementation.status=='ok'){
            let temp = parseInt(btn.innerHTML)+1;
            btn.innerHTML=temp;
        }
    }
});