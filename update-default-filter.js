const fs = require('fs');

const targetPath = 'components/DateFilter.tsx';
let content = fs.readFileSync(targetPath, 'utf8');

const oldDefault = `export const defaultDateFilter = () => {
  const d = new Date()
  d.setDate(d.getDate() - 28)
  return {
    preset: 'last_4_weeks',
    from: fmtDateInput(getWeekStart(d)),
    to: fmtDateInput(new Date()),
    year: 'all',
    month: 'all',
    week: 'all',
    weekRanges: undefined
  }
}`;

const newDefault = `export const defaultDateFilter = () => {
  return {
    preset: 'all_time',
    from: '',
    to: '',
    year: 'all',
    month: 'all',
    week: 'all',
    weekRanges: undefined
  }
}`;

if (content.includes("preset: 'last_4_weeks'")) {
  content = content.replace(oldDefault, newDefault);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log("Updated defaultDateFilter to all_time");
} else {
  console.log("Could not find the block to replace.");
}