const ExcelJS = require('exceljs');

exports.readFile = async (filename) => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(filename);

  // Can process years in parallel for efficiency
  return Promise.all([
    processYear(workbook, '2019'),
    processYear(workbook, '2017'),
    processYear(workbook, '2015'),
    processYear(workbook, '2010')
  ]);
}

async function processYear(wb, year) {
  const sheet = wb.getWorksheet(year);

  // Object which will hold all data about the year
  const data = { year, constituencies: {} };

  // First get party names from row 3 (corresponding columns contain votes)
  const partyCols = {}
  sheet.getRow(3).eachCell((cell, col) => {
    // Heading occupies two merged cells, we want the first column value
    partyCols[cell.value] = col - 1;
  });

  // Now the data can be extracted per constituency (row)
  sheet.eachRow((row, rowNum) => {
    if (rowNum <= 4) return; // Skip heading rows

    // From 2010 onward, column B contains the GSS ID (ONS ID) for all regions
    const gssId = row.getCell(2).value;

    // Skip rows at bottom without data
    if (!(gssId)) return;

    // Extract each parties votes using columns obtained earlier
    const parties = {};
    for (const k in partyCols) {
      const votes = row.getCell(partyCols[k]).value;

      // Not every party runs in every region
      if (votes) {
        parties[k] = votes;
      }
    }

    data.constituencies[gssId] = {
      electorate: row.getCell(7).value, // column 7 always has electorate
      parties
    };
  });

  return data;
}