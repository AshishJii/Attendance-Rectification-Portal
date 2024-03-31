const tableBody = document.querySelector("#rectifsTable tbody");
const tableHead = document.querySelector("#rectifsTable thead");
const ByStudentBut = document.querySelector("#grpByStudent");
const ByFacultyBut = document.querySelector("#grpByFaculty");

const headings_grpStudent =  ['No.','Name/ID','Date','Periods','Delete?'];
const headings_grpFaculty = ['Faculty','Date','ID','Name','Periods','Share'];

const GRPED_BYSTUDENT_RECTIF_URL = 'http://127.0.0.1:4001/api/rectifs_bystudent';
const GRPED_BYFACULTY_RECTIF_URL = 'http://127.0.0.1:4001/api/rectifs_byfaculty';
const DELETE_RECTIF_URL = 'http://127.0.0.1:4001/api/rectifications/';

ByStudentBut.addEventListener('click', () => populateByStudent());
ByFacultyBut.addEventListener('click', () => populateByFaculty());

window.onload = () => populateByStudent();

populateHead = (headings) => {
    tableHead.innerHTML = "";
    let row = document.createElement("tr");
    headings.forEach(heading => {
        let th = document.createElement("th");
        th.textContent = heading;
        row.appendChild(th);
    });
    tableHead.append(row);
}

populateByStudent = () => {
    populateHead(headings_grpStudent);
    tableBody.innerHTML = "";
    fetchRectifsAPI(GRPED_BYSTUDENT_RECTIF_URL).then( res => {
        let serialNo = 1;
        console.log(JSON.stringify(res));
        res.data.forEach(rectif=> {
            let row = createRow_studentGrp(rectif, serialNo++);
            tableBody.appendChild(row);
        })
    });
    
    tableBody.addEventListener('click', addDeleteListeners);
}

populateByFaculty = () => {
    populateHead(headings_grpFaculty);
    tableBody.innerHTML = "";
    fetchRectifsAPI(GRPED_BYFACULTY_RECTIF_URL).then( res => {
        console.log(JSON.stringify(res));

        res.data.forEach(faculty => {
            faculty.rectifs.forEach((rectif, rectifIndex) => {
              rectif.students.forEach((student, studentIndex) => {

                let row = document.createElement("tr");
                row.innerHTML =`
                  <tr>
                    ${rectifIndex == 0 && studentIndex === 0 ? `<td rowspan="${calculateFacultyRowspan(faculty.rectifs)}">${faculty._id}</td>` : ''}
                    ${studentIndex === 0 ? `<td rowspan="${rectif.students.length}">${rectif.date}</td>` : ''}
                    
                    <td>${student.student.roll}</td>
                    <td>${student.student.name}</td>
                    <td>${JSON.stringify(student.periodsArr)}</td>
                    
                    ${rectifIndex == 0 && studentIndex === 0 ?
                        `<td rowspan="${calculateFacultyRowspan(faculty.rectifs)}"><button class='share-button' >🏃</button></td>` : ''}
                  </tr>
                `;

                tableBody.appendChild(row);
              });
            });
          });
    });
    

    //REMOVE BELOW LINE // INSTEAD ADD DELETE ALL BUTTON
    //tableBody.addEventListener('click', addDeleteListeners);
    tableBody.addEventListener('click', addShareListeners);
}

//Attaching listeners to delete buttons
addDeleteListeners = (e) => {
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
}

addShareListeners = (e) => {
    if(e.target.classList.contains('share-button')){
        // let row = e.target.closest('tr');
        // let id = row.getAttribute('data-roll');
        // console.log(`Delete button clicked for ID: ${id}`);

        alert('Our Elite team of developers is working hard to implement this feature. Stay tuned!😁');
    }
}

const createRow_studentGrp = (rectif, serialNo) => {
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

function calculateFacultyRowspan(rectifs) {
    return rectifs.reduce((total, rectif) => total + rectif.students.length, 0);
}

// API CALLERS
//GET rectifications API
fetchRectifsAPI = async (url) => {
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
    const url = DELETE_RECTIF_URL+id;
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