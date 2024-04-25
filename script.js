


const moreThen2 = {};
const moreThen5 = {};

document.getElementById('fileInput').addEventListener('change', handle);

function handle(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);
       console.log(jsonData)

        const dates = getDate(jsonData);
        console.log(dates)
        buildObjects(jsonData, dates);

        console.log(moreThen2);
        console.log(moreThen5);
    };

    reader.readAsArrayBuffer(file);
}

function buildObjects(jsonData, dates) {
    for (let i = 1; i < jsonData.length; i++) { 
        const row = jsonData[i];
        const value = row[0]; 
        const manager = row[1]; 

      console.log(row)
      console.log(value)
      console.log(manager)
    }
}


function getDate(jsonData) {
    const dates = [];
    for (let dateKey in jsonData[0]) { 
        if (!dateKey.includes("EMPTY") && !dateKey.includes("סה")) {
dates.push(dateKey);
        }
        
    }
    return dates;
}








document.querySelector("#downloadExcel").addEventListener("click", createNewExcel);

function createNewExcel() {
    let headers = ["שם מקור דיווח ", "תאריך", "תקן", "ביצוע", "פער"];
    let combinedData = [headers];
    let combinedData5 = [headers];

    buildRows(moreThen2, combinedData);
    buildRows(moreThen5, combinedData5);
    console.log(combinedData);
    console.log(combinedData5);
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
    const worksheet5 = XLSX.utils.aoa_to_sheet(combinedData5);

    XLSX.utils.book_append_sheet(workbook, worksheet, '2');
    XLSX.utils.book_append_sheet(workbook, worksheet5, '5');

    // Save the workbook to a file
    XLSX.writeFile(workbook, 'output.xlsx');

    console.log("Data has been successfully exported to output.xlsx");
}

function buildRows(fiveOrTwo, array) {
    for (let store in fiveOrTwo) {
        for (let date in fiveOrTwo[store]) {
            const dateData = fiveOrTwo[store][date];
            const rowData = [
                store,
                date,
                dateData["תקן"],
                dateData["ביצוע"],
                dateData["פער"]
            ];
            array.push(rowData);
        }
    }
}
