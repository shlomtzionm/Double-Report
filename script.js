document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
      
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const modifiedJsonData = {};
       
        for (let i = 2; i < jsonData.length - 1; i++) {
            const row = jsonData[i];
            const value = row[0];
            
            
            modifiedJsonData[value] = 0
        }

        console.log(modifiedJsonData);
    };

    reader.readAsArrayBuffer(file);
});
