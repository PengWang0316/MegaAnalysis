const MEGA_REGX = /<tr class.+?<td class="dates">(.+?)<\/td>.+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?<\/tr>/g;

function analysis(mageData) {
  console.log(mageData);
}

function getMegaDataArray(megaData) {
  const result = [];
  let match;
  while (match = MEGA_REGX.exec(megaData)) result.push({
    date: match[1],
    balls: [match[2], match[3], match[4], match[5], match[6]],
    megaBall: match[7],
    megaplier: match[8]
  });
  return reslut;
}


/**
 * If the Mage data has already been fetched and stored in the localStorage, analyze them directly.
 * Otherwise, fetch all data and store in the localStorage.
 */
$(document).ready(() => {
  const megaDataArray = getMegaDataArray(megaData);
  const balls = {};
  const megaBalls = {};

});
