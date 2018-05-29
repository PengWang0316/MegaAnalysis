const MEGA_REGX = /<tr class.+?<td class="dates">(.+?)<\/td>.+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?<\/tr>/g; // Use to get all winnig number and date from the source data.
const YEAR_REGX = /\/(\d+)$/; // Use to get year from a date string.

function analyze(mageData) {
  const result = { all: { megaBall: {}, balls: {} } };
  mageData.forEach(data => {
    const year = YEAR_REGX.exec(data.date)[1];
    if (!result[year]) result[year] = { megaBall: {}, balls: {} }; // Initalize if this year's data is still empty.

    // Start to get mega ball data
    result[year].megaBall[data.megaBall] = result[year].megaBall[data.megaBall] ? result[year].megaBall[data.megaBall] + 1 : 1;
    result.all.megaBall[data.megaBall] = result.all.megaBall[data.megaBall] ? result.all.megaBall[data.megaBall] + 1 : 1;

    //Start to get balls data
    data.balls.forEach(ball => {
      result[year].balls[ball] = result[year].balls[ball]  ? result[year].balls[ball] + 1 : 1;
      result.all.balls[ball] = result.all.balls[ball]  ? result.all.balls[ball] + 1 : 1;
    });
  });
  console.log(result);
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
  return result;
}


/**
 * If the Mage data has already been fetched and stored in the localStorage, analyze them directly.
 * Otherwise, fetch all data and store in the localStorage.
 */
$(document).ready(() => {
  analyze(getMegaDataArray(megaData));
});
