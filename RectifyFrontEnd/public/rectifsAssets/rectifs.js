const tableBody = document.querySelector("#rectifsTable tbody");
window.onload = ()=>populateTable();

populateTable = () => {
    tableBody.innerHTML = "";
    fetchRectifsAPI().then( res => {
        let serialNo = 1;
        res.forEach(rectif=> {
            let row = createTableRow(rectif, serialNo++);
            tableBody.appendChild(row);
        })
    });
}

//Attaching listeners to delete buttons
tableBody.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete-button')){
        let row = e.target.closest('tr');
        let roll = row.getAttribute('data-roll');
        console.log(`Delete button clicked for roll: ${roll}`);

        deleteRecordAPI(roll).then(res => {
            row.remove();
        }).catch(err => {
            console.error('Error deleting record:', err);
        });
    }
})

const createTableRow = (rectif, serialNo) => {
    let row = document.createElement("tr");
    row.setAttribute("data-roll", rectif.roll);
    row.innerHTML = `
    <td>${serialNo}.</td>
    <td>
        <span>${rectif.Name}</span><br>
        <span>${rectif.roll}</span><br>
        <img width="100" src="${rectif.Image}">
    </td>
    <td>${rectif.date}</td>
    <td>${rectif.periodsArr.map(ob => `<br>${ob.no} : ${ob.faculty}`).join('')}</td>
    <td>
        <img class='delete-button' width='35' src='rectifsAssets/remove.png' alt='Delete'>
    </td>
    `
    return row;
}

// API CALLERS

//constants declarations
const RECTIFICATIONS_URL = 'http://127.0.0.1:4001/api/rectifications/';

//GET rectifications API
fetchRectifsAPI = async () => {
    const url = RECTIFICATIONS_URL;

    try{
        const data =  await fetch(url);
        if (!data.ok) {
            throw new Error(`Failed to fetch data. Status: ${data.status}`);
        }

        const rectifs = await data.json();
        return rectifs;
    }
    catch (err){
        console.error("ERROR in fetchAPI: ", err);
        throw err;
    }
}

//DELETE record API
deleteRecordAPI = async (roll) => {
    const url = RECTIFICATIONS_URL+roll;
    let postData = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
    };
    try {    
        const res = await fetch(url, postData);
        if(!res.ok){
            throw new Error(`Failed to Submit request. Status: ${res.status}`);
        }
        console.log(res);
        return res;
    } 
    catch (err) {
        console.error("Error in submitRequestAPI:", err);
        throw err;
    }
}