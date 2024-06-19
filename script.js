const moreThen = {
    2: {},
    5: {}
};

let body = document.querySelector("body");
let fileInput = document.getElementById('fileInput')

fileInput.addEventListener('change', handleExcel);

function handleExcel(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    removeDownloadButton()

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const dates = getDates(jsonData);
        console.log(dates)
        buildObjects(jsonData, dates);
    }

    reader.readAsArrayBuffer(file);
}

function buildObjects(jsonData, dates) {
    for (let i = 2; i < jsonData.length; i++) {
        const row = jsonData[i];
        const value = row[0];
        const manager = row[1];
    
        for (let j = 0; j < dates.length; j++) {
            const currentDate = dates[j];

            const performance = jsonData[i][j * 3 + 4];
            const gap = jsonData[i][j * 3 + 5];
    
            if ((jsonData[i][j * 3 + 3] !== undefined) && (gap < -2)) {
             
                let data = builDateObj(performance,gap,jsonData,i,j)
            pushToMoreThen(2,value,currentDate,data,manager)
            } 
            if ((jsonData[i][j * 3 + 3] === undefined) && (gap < -5)){
                let data = builDateObj(performance,gap,jsonData,i,j)
            pushToMoreThen(5,value,currentDate,data,manager)
            }
        }
    }
    creatDownloadButton()
    }
    
    function builDateObj(performance,gap,jsonData,i,j){
        let data = {
            "תקן": jsonData[i][j * 3 + 3],
            "ביצוע": performance,
            "פער": gap,
        };
        return data
    }
    
    function pushToMoreThen(towOrFive, value, currentDate, data, manager) {
        let object = moreThen[towOrFive][value]; 
        if (!object) {
            object = {};
            moreThen[towOrFive][value] = object; 
        }
        object[currentDate] = data;
        object["מנהל"] = manager;
    }

function getDates(jsonData) {
    const dates = [];
    for (let i = 3; i < jsonData[0].length; i++) {
        const excelDateValue = jsonData[0][i];
        const jsDate = new Date((excelDateValue - (25567 + 2)) * 86400 * 1000);
        const formattedDate = moment(jsDate).format('YYYY-MM-DD');
      
        if (formattedDate !== "Invalid date") {
            dates.push(formattedDate);
        }
    }
    return dates;
}


function createNewExcel() {
    let headers = ["שם מקור דיווח ", "תאריך", "תקן", "ביצוע", "פער","מנהל"];
    let combinedData = [headers];
    let combinedData5 = [headers];

    buildRowsInNewFile(2, combinedData);
    buildRowsInNewFile(5, combinedData5);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
    const worksheet5 = XLSX.utils.aoa_to_sheet(combinedData5);

    XLSX.utils.book_append_sheet(workbook, worksheet, '2');
    XLSX.utils.book_append_sheet(workbook, worksheet5, '5');

    XLSX.writeFile(workbook, 'כפילויות.xlsx');

}

function buildRowsInNewFile(fiveOrTwo, array) {
    for (let store in moreThen[fiveOrTwo]) {
        for (let date in moreThen[fiveOrTwo][store]) {
            if(date !== "מנהל" && store !== 'סה"כ'){
                const dateData = moreThen[fiveOrTwo][store][date];
                const rowData = [
                    store,
                    date,
                    dateData["תקן"],
                    dateData["ביצוע"],
                    dateData["פער"],
                    moreThen[fiveOrTwo][store]["מנהל"]
                ];
                array.push(rowData);
  
            }
        }
    }
}

function creatDownloadButton() {
    let button = document.createElement('button');
    button.id = "downloadExcel";
button.innerHTML="להורדת דוח כפילויות"
    body.appendChild(button);
    
button.addEventListener("click", createNewExcel);
}

function removeDownloadButton() {
    const buttonToRemove = document.querySelector("#downloadExcel");
    if (buttonToRemove) {
        buttonToRemove.parentNode.removeChild(buttonToRemove);
    }
}
