const teen = [
  ,
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eightteen",
  "Nineteen",
];
const puluhan = [
  ,
  "Ten",
  "Twenty",
  "Thirty",
  "Fourty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const angka = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const satuanBesar = [
  ,
  "Thousand",
  "Million",
  "Billion",
  "Trillion",
  "Quadrillion",
  "Quintillion",
  "Sextillion",
  "Septillion",
  "Octillion",
  "Nonillion",
  "Decillion",
  "Undecillion",
  "Duodecillion",
  "Tredecillion",
  "Quattuordecillion",
  "Quindecillion",
  "Sexdecillion",
  "Septendecillion",
  "Octodecillion",
  "Novemdecillion",
  "Vigintillion",
];

function numToString(num) {
  let result = "";
  let currentNum = num;
  let processedNum;
  let counter = 0;
  while (currentNum > 0) {
    if (currentNum > 999) {
      if (currentNum % 1000 === 0) {
        currentNum = Math.floor(currentNum / 1000);
        counter++;
        continue;
      } else {
        processedNum = currentNum % 1000;
      }
      currentNum = Math.floor(currentNum / 1000);
    } else {
      processedNum = currentNum;
      currentNum = 0;
    }
    let hundreds = Math.floor(processedNum / 100)
      ? angka[Math.floor(processedNum / 100)] + " hundred "
      : "";
    let dozens = "";
    let unit = "";
    if (Math.floor((processedNum % 100) / 10) === 1 && processedNum % 10 > 0) {
      dozens = teen[(processedNum % 100) % 10];
    } else {
      dozens =
        Math.floor((processedNum % 100) / 10) > 0
          ? puluhan[Math.floor((processedNum % 100) / 10)]
          : "";
      unit = processedNum % 10 > 0 ? angka[processedNum % 10] : "";
    }

    result =
      hundreds +
      dozens +
      " " +
      unit +
      " " +
      satuanBesar[counter] +
      " " +
      result;
    counter++;
  }
  return normalizeSpaces(result);
}

function normalizeSpaces(string) {
  return string.replace(/\s+/g, " ").trim();
}

console.log(numToString(10010000));
