const modifiedJsonData = {};

function getStoreName(jsonData) {
    for (let i = 2; i < jsonData.length - 1; i++) {
        const row = jsonData[i];
        const value = row[0];
        modifiedJsonData[value] = { index: i };
    }
}

function getDate(jsonData) {
    const dates = [];

    for (let i = 0; i < jsonData[0].length; i++) {
        const excelDateValue = jsonData[0][i];

        const jsDate = new Date((excelDateValue - (25567 + 2)) * 86400 * 1000);
        const formattedDate = moment(jsDate).format('YYYY-MM-DD');

        if (formattedDate !== "Invalid date") {
            dates.push(formattedDate);
        }
    }

    return dates;
}

function handel(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        getStoreName(jsonData);
        const dates = getDate(jsonData);

        for (let store in modifiedJsonData) {
            const storeIndex = modifiedJsonData[store].index;
            modifiedJsonData[store]["data"] = {}; // Create an object to store data for each store
        
            for (let j = 0; j < dates.length; j++) {
                const currentDate = dates[j];
                modifiedJsonData[store]["data"][currentDate] = {
                    "תקן": jsonData[storeIndex][3 + 3 * j],
                    "ביצוע": jsonData[storeIndex][4 + 3 * j],
                    "פער": jsonData[storeIndex][5 + 3 * j]
                };
            }
        }
        
        
        
        

        console.log(modifiedJsonData);
    };

    reader.readAsArrayBuffer(file);
}

document.getElementById('fileInput').addEventListener('change', handel);