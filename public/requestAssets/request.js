//Declaring variables
const buttonsContainer = document.querySelector(".buttonContainer");
const rollInput = document.querySelector("#rollIn");
const pdContainer = document.querySelector("#personData");
const dateInput = document.querySelector("#dateIn");
const submitBut = document.querySelector("#submitBut");
const verifyBut = document.querySelector("#verifyBut");

//Event listeners
dateInput.addEventListener('change', () => dateHandler(dateInput));
buttonsContainer.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON')
        buttonClicked(e.target);
});
submitBut.addEventListener('click', ()=>handleSubmit());
verifyBut.addEventListener('click', ()=>fetchData());

const selectedButs = new Array(9).fill(false);
//final form data
let formData = {
    roll: null,
    date:null,
    periodsArr:[]   // {"no":6,"faculty":"Shami"}
}

const buttonClicked = but => {
    but.classList.toggle('selectedPeriod');
    const idx = but.getAttribute("index");
    selectedButs[idx] = !selectedButs[idx];
    console.log(selectedButs);
}

const dateHandler = ele => formData.date = ele.value;

// fetches name & image from roll no.
const fetchData = () => {
    const roll = rollInput.value;
    if(roll === '')
        return alert("Please enter Roll no.");
    
    fetchInfoAPI(roll)
        .then((msg) => {
            console.log("Fetched Data : "+JSON.stringify(msg.data.student));
            pdContainer.innerHTML = "";
            if(msg.status !== 'success'){
                const msgElement = document.createElement('span');
                msgElement.textContent = msg.message;
                pdContainer.appendChild(msgElement);
            }
            else{   //msg.status == 'success'
                const student = msg.data.student;
                const imagElement = document.createElement('img');
                Object.assign(imagElement.style, {
                    width: '0px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                    transition: 'width 0.5s ease',
                });
                imagElement.src = student.imageLink;
                imagElement.alt = student.imageLink;
                
                
                const namElement = document.createElement('div');
                Object.assign(namElement.style, {
                    margin: '15px',
                    fontWeight: 'bold',
                    fontSize: '0px',
                    transition: 'font-size 0.5s',
                });
                namElement.textContent = student.name;

                imagElement.onload = function () {
                    pdContainer.appendChild(imagElement);
                    pdContainer.appendChild(document.createElement("br"))
                    pdContainer.appendChild(namElement);
                    
                    setTimeout(() => {
                        imagElement.style.width = '200px';
                        namElement.style.fontSize = '20px';
                    }, 50);
                };

                formData.roll = roll;
            }
        })
        .catch(e => console.error("Error in fetchData: ", e)); 
}



// validate data before submitting form
const validateData = () => {
    if(formData.roll==null){
        alert("Please verify Roll no. first🙅🙅");
        return false;
    }
    if(formData.date == null){
        alert("Please fill Date first🙅🙅");
        return false;
    }
    if(selectedButs.every(el => el==false)){
        alert("Select atleast one period🙅🙅");
        return false;
    }

    return true;
}

// submitting info
const handleSubmit = () => {
    if(!validateData()) return;

    //formData.periodsArr = selectedButs.map((sel, idx) => sel ? { "no": idx + 1, "faculty": "Amitas" } : null).filter(Boolean);
    selectedButs.forEach((sel, idx) =>{
        if(sel)
            formData.periodsArr.push({
                "no": idx + 1,
                "faculty": "Amitas"
        })
    })
    console.log("Submitting data : "+JSON.stringify(formData));

    submitRequestAPI(formData)
        .then( res => {
            if(res.status == 201){ 
                alert("Request Submitted. See Console");
                formData = {
                    roll: null,
                    date:null,
                    periodsArr:[]
                }
            }
        })
        .catch(e => console.error("Error in handleSubmit: ", e));
};

// API CALLERS

//constants declarations
const GET_STDATA_URL = 'http://127.0.0.1:4001/api/students/';
const POST_RECTIFICATIONS_URL = 'http://127.0.0.1:4001/api/rectifications/';

//GET studentData API
fetchInfoAPI = async (roll) => {
    const req = GET_STDATA_URL+roll;

    try{
        const data =  await fetch(req);
        const personDa = await data.json();
        return personDa;
    }
    catch (err){
        console.error("ERROR in fetchAPI: ", err);
        throw err;
    }
}

//POST rectification API
submitRequestAPI = async () => {
    const req = POST_RECTIFICATIONS_URL;
    let postData = {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

    try {    
        const res = await fetch(req, postData);
        if(!res.ok){
            throw new Error(`Failed to Submit request. Status: ${res.status}`);
        }
        return res;
    } 
    catch (err) {
        console.error("Error in submitRequestAPI:", err);
        throw err;
    }
}