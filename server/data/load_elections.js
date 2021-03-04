const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();

exports.readfile = async function(filename) {
  await workbook.xlsx.readFile(filename);
}