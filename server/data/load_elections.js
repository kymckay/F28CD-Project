const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();

exports.readFile = async (filename) => {
  await workbook.xlsx.readFile(filename);
}