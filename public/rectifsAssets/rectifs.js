const tableBody = document.querySelector("#rectifsTable tbody");
const tableHead = document.querySelector("#rectifsTable thead");
const ByStudentBut = document.querySelector("#grpByStudent");
const ByFacultyBut = document.querySelector("#grpByFaculty");

const headings_grpStudent =  ['No.','Name/ID','Date','Periods','Delete?'];
const headings_grpFaculty = ['Faculty','Date','ID','Name','Periods','Send'];

const GRPED_BYSTUDENT_RECTIF_URL = 'http://127.0.0.1:4001/api/rectifs_bystudent';
const GRPED_BYFACULTY_RECTIF_URL = 'http://127.0.0.1:4001/api/rectifs_byfaculty';
const DELETE_RECTIF_URL = 'http://127.0.0.1:4001/api/rectifications/';

//(temporary:when updating here, update the list at request.js also). later this will come from api calls.
const FACULTY_MAP = {'Amitas': 9208456642, 'Syed Suboor Aziz': 9695856417, 'Atul Chaturvedi':9412158877,'Smeeta Mishra':8586079093};

ByStudentBut.addEventListener('click', () => populateByStudent());
ByFacultyBut.addEventListener('click', () => populateByFaculty());

window.onload = () => populateByStudent();

populateByStudent = () => {
    populateHead(headings_grpStudent);
    tableBody.innerHTML = "";
    fetchRectifsAPI(GRPED_BYSTUDENT_RECTIF_URL).then( res => {
        console.log(JSON.stringify(res));

        let serialNo = 1;
        res.data.forEach(rectif=> {
            let row = createRow_studentGrp(rectif, serialNo++);
            tableBody.appendChild(row);
        });
        tableBody.addEventListener('click', addDeleteListeners);
    }).catch(err=> console.log(JSON.stringify(err)));
}

populateByFaculty = () => {
    populateHead(headings_grpFaculty);
    tableBody.innerHTML = "";
    fetchRectifsAPI(GRPED_BYFACULTY_RECTIF_URL).then( res => {
        console.log(JSON.stringify(res));

        res.data.forEach(faculty => {
            faculty.rectifs.forEach((rectif, rectifIndex) => {
              rectif.students.forEach((student, studentIndex) => {
                let row = createRow_facultyGrp(faculty, rectif, student, rectifIndex, studentIndex);
                tableBody.appendChild(row);
              });
            });
          });
          tableBody.addEventListener('click', (e) => addShareListeners(e, res.data));
    }).catch(err=> console.log(JSON.stringify(err)));;
}

const addDeleteListeners = (e) => {
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

const addShareListeners = (e,data) => {
    if(!e.target.classList.contains('share-button')) return;

    let row = e.target.closest('tr');
    let id = row.getAttribute('data-faculty');

    let phoneNum = FACULTY_MAP[id]; //getting faculty name from static global array; TODO : change it

    console.log(`Faculty: ${id} ${phoneNum}`);
    const perio = data.find(item => item._id === id);

    let result = "";
    perio.rectifs.forEach(rectif => {
        result += `\nDate: ${rectif.date}\n---------------------\n`;
        rectif.students.forEach(studentInfo => {
            const student = studentInfo.student;
            const periods = studentInfo.periodsArr.join(', ');
            result += `${student.name}(${student.roll})\nPeriod: ${periods}\n`;
        });
    });

    const urlFriendlyText = encodeURIComponent(result);

    //Temporary override
    phoneNum = 6394909077;

    const waMeLink = `https://wa.me/91${phoneNum}?text=${urlFriendlyText}`;
    window.open(waMeLink, '_blank');
}

const populateHead = (headings) => {
    tableHead.innerHTML = "";
    let row = document.createElement("tr");
    headings.forEach(heading => {
        let th = document.createElement("th");
        th.textContent = heading;
        row.appendChild(th);
    });
    tableHead.append(row);
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

const createRow_facultyGrp = (faculty, rectif, student, rectifIndex, studentIndex) => {
    let row = document.createElement("tr");
    row.setAttribute("data-faculty", faculty._id);
    row.innerHTML = `
        ${rectifIndex == 0 && studentIndex === 0 ? `<td rowspan="${calculateFacultyRowspan(faculty.rectifs)}">${faculty._id}</td>` : ''}
        ${studentIndex === 0 ? `<td rowspan="${rectif.students.length}">${rectif.date}</td>` : ''}
        <td>${student.student.roll}</td>
        <td>${student.student.name}</td>
        <td>${JSON.stringify(student.periodsArr)}</td>
        ${rectifIndex == 0 && studentIndex === 0 ? `<td rowspan="${calculateFacultyRowspan(faculty.rectifs)}"><button class='share-button'>🏃</button></td>` : ''}
    `;
    return row;
};

//helper function for createRow_facultyGrp(for calculating row merges)
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