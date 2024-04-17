const modifiedJsonData = {};

function getStoreName(jsonData) {
    for (let i = 2; i < jsonData.length - 1; i++) {
        const row = jsonData[i];
        const value = row[0];
        modifiedJsonData[value] = {};
    }
}

function getDate(jsonData) {
    const dates = [];
    // Iterate over the first row (excluding the first cell)
    for (let i = 0; i < jsonData[0].length; i++) {
        const excelDateValue = jsonData[0][i]; 
    
        const jsDate = new Date((excelDateValue - (25567 + 1)) * 86400 * 1000);
        const formattedDate = moment(jsDate).format('YYYY-MM-DD');
        dates.push(formattedDate);
 
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

        // Assign dates to modifiedJsonData for each store
        for (let store in modifiedJsonData) {
            for (let i = 0; i < dates.length; i++) {
                modifiedJsonData[store][dates[i]] = 0;
           
            }
        }

        console.log(modifiedJsonData);
    };

    reader.readAsArrayBuffer(file);
}

document.getElementById('fileInput').addEventListener('change', handel);
