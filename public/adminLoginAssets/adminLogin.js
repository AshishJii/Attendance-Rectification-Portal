//Declaring variables
const loginBut = document.querySelector("#loginBut");
const username = document.querySelector('#username');
const password = document.querySelector('#password');


const LOGIN_URL ='http://127.0.0.1:4001/login';
//Event listeners
loginBut.addEventListener('click', () => {
    console.log('clicked');
    console.log(username.value,password.value);
    loginAPI().then(res => {
        if(res.status == 200){
            window.location.href = "./rectifications";
        }
    }).catch(err => {
        alert('Login Failed. Invalid Credentials!');
    })    
});


loginAPI = async () => {
    const req = LOGIN_URL;
    let postData = {
            method: "POST",
            body: JSON.stringify({
                username: username.value,
                password: password.value
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

    try {    
        const res = await fetch(req, postData);
        if(!res.ok){
            throw new Error(`Login Failed. Status: ${res.status}`);
        }
        return res;
    } 
    catch (err) {
        console.error("Error in LoginAPI:", err);
        throw err;
    }
}