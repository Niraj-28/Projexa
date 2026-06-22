const convertToCSV = (data, fields) => {
  const header = fields.join(',');
  const rows = data.map((row) =>
    fields
      .map((fieldName) => {
        const val = row[fieldName];
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(',')
  );
  return [header, ...rows].join('\r\n');
};

module.exports = { convertToCSV };
