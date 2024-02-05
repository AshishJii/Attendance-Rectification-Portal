const tableBody = document.querySelector("#rectifsTable tbody");
window.onload = ()=>populateTable();

populateTable = () => {
    tableBody.innerHTML = "";
    fetchRectifsAPI().then( res => {
        let serialNo = 1;
        console.log(JSON.stringify(res));
        const rectifs = res.data.rectifs;
        rectifs.forEach(rectif=> {
            let row = createTableRow(rectif, serialNo++);
            tableBody.appendChild(row);
        })
    });
}

//Attaching listeners to delete buttons
tableBody.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete-button')){
        let row = e.target.closest('tr');
        let id = row.getAttribute('data-roll');
        console.log(`Delete button clicked for ID: ${id}`);

        deleteRecordAPI(id).then(res => {
            row.remove();
        }).catch(err => {
            console.error('Error deleting record:', err);
        });
    }
})

const createTableRow = (rectif, serialNo) => {
    let row = document.createElement("tr");
    row.setAttribute("data-roll", rectif._id);
    row.innerHTML = `
    <td>${serialNo}.</td>
    <td>
        <span>${rectif.student.name}</span><br>
        <span>${rectif.student.roll}</span><br>
        <img width="100" src="${rectif.student.imageLink}">
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
deleteRecordAPI = async (id) => {
    const url = RECTIFICATIONS_URL+id;
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