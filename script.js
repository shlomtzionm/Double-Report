

const moreThen2 = {};
const moreThen5 = {};

document.getElementById('fileInput').addEventListener('change', handel);

function handel(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const dates = getDate(jsonData); 

        buildObjects(jsonData, dates); 

        console.log(moreThen2);
        console.log(moreThen5);
        
    };

    reader.readAsArrayBuffer(file);
}

function buildObjects(jsonData, dates) {
    for (let i = 5; i < jsonData.length; i++) {
        console.log('Current row:', jsonData[i]);

        const row = jsonData[i];
        const value = row[0];

        for (let j = 4; j < dates.length; j++) {
            const currentDate = dates[j];
            const standardIndex = 1 + 3 * j;
          
            const performance = jsonData[i][standardIndex + 1];
            const gap = jsonData[i][standardIndex + 2];

            console.log('Performance:', performance);
            console.log('Gap:', gap);

            if ((jsonData[i][standardIndex] !== undefined) && (gap < -2)) {
                let data = { [currentDate]: {
                            "תקן": jsonData[i][standardIndex],
                            "ביצוע": performance,
                            "פער": gap
                        }
                };
                moreThen2[value] = data;
            } else if ((jsonData[i][standardIndex] === undefined) && (gap < -5)) {
                let data= {[currentDate]: {
                            "תקן": undefined,
                            "ביצוע": performance,
                            "פער": gap
                        }
                    
                };
                moreThen5[value] = data;
            }
        }
    }
}





function getDate(jsonData) {
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








document.querySelector("#downloadExcel").addEventListener("click",creatNewExcel)

function creatNewExcel() {
    let headers = ["שם מקור דיווח ", "תאריך", "תקן", "ביצוע", "פער"];
    let combinedData = [headers];
    let combinedData5 = [headers];

    buildRows(moreThen2, combinedData);
    buildRows(moreThen5, combinedData5);
console.log(combinedData)
console.log(combinedData5)
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
    const worksheet5 = XLSX.utils.aoa_to_sheet(combinedData5);

    XLSX.utils.book_append_sheet(workbook, worksheet, '2');
    XLSX.utils.book_append_sheet(workbook, worksheet5, '5');

    // Save the workbook to a file
    XLSX.writeFile(workbook, 'output.xlsx');

    console.log("Data has been successfully exported to output.xlsx");
}

function buildRows(fiveOrTow, array) {
    for (let store in fiveOrTow) {
        for (let date in fiveOrTow[store]) {
            const dateData = fiveOrTow[store][date];
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
