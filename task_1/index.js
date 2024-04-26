import { encoded, translations } from "./data.js";

console.log("Let's rock");
//console.log(encoded, translations);

console.log(decoded(encoded));
function decoded(array) {
  const exclude = new Set(["groupId", "service", "formatSize", "ca"]);
  let result = [];

  for (let item of array) {
    result.push({ ...item });
  }

  let uniqObj = new Map();
  let uniqList = [];

  const translationsSet = new Set(Object.keys(translations));

  for (const item of result) {
    for (const key in item) {
      if (!uniqObj.has(item[key]) && item[key] in translations) {
        uniqObj.set(item[key], 0);
      }

      uniqObj.set(item[key], uniqObj.get(item[key]) + 1);
      
      if (!exclude.has(key) && translationsSet.has(item[key])) {
        item[key] = translations[item[key]];
      }
    }
  }

  for (const [key, val] of uniqObj) {
    if (val === 1) {
      uniqList.push(key);
    }
  }

  return { result, uniqList };
}
