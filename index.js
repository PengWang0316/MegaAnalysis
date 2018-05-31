const MEGA_REGX = /<tr class.+?<td class="dates">(.+?)<\/td>.+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?(\d+).+?<\/tr>/g; // Use to get all winnig number and date from the source data.
const YEAR_REGX = /\/(\d+)$/; // Use to get year from a date string.

let megaObject;

function getEmptyBallsObject() {
  const balls = {};
  for (let i = 1; i <= 70; i++) balls[i] = 0;
  return balls;
}

function getEmptyMegaBallsObject() {
  const megaBalls = {};
  for (let i = 1; i <= 25; i++) megaBalls[i] = 0;
  return megaBalls;
}

function analyze(mageData) {
  const result = { all: { megaBall: getEmptyMegaBallsObject(), balls: getEmptyBallsObject() } };
  mageData.forEach(data => {
    const year = YEAR_REGX.exec(data.date)[1];
    if (!result[year]) result[year] = { megaBall: getEmptyMegaBallsObject(), balls: getEmptyBallsObject() }; // Initalize if this year's data is still empty.

    // Start to get mega ball data
    result[year].megaBall[data.megaBall] = result[year].megaBall[data.megaBall] ? result[year].megaBall[data.megaBall] + 1 : 1;
    result.all.megaBall[data.megaBall] = result.all.megaBall[data.megaBall] ? result.all.megaBall[data.megaBall] + 1 : 1;

    //Start to get balls data
    data.balls.forEach(ball => {
      result[year].balls[ball] = result[year].balls[ball] ? result[year].balls[ball] + 1 : 1;
      result.all.balls[ball] = result.all.balls[ball] ? result.all.balls[ball] + 1 : 1;
    });
  });
  return result;
}

function generateHtmlText(megaData) {
  let htmlText = ''; // internal html text.
  Object.keys(megaData).forEach(yearLable => {
    let ballsHtml = '';
    let megaBallsHtml = '';
    //Get a sorted key array for the balls object.
    const ballsSortingKeys = Object.keys(megaData[yearLable].balls)
      .sort((pervious, next) => megaData[yearLable].balls[pervious] - megaData[yearLable].balls[next]);
    // Assembling the html text for balls data
    ballsSortingKeys.forEach(key => ballsHtml += `<span class="mr-3 ball">${key}<span class="badge badge-primary small ml-1">${megaData[yearLable].balls[key]}</span></span>`);

    //Get a sorted key array for the mega balls object.
    const megaBallsSortingKeys = Object.keys(megaData[yearLable].megaBall)
      .sort((pervious, next) => megaData[yearLable].megaBall[pervious] - megaData[yearLable].megaBall[next]);
    // Assembling the html text for balls data
    megaBallsSortingKeys.forEach(key => megaBallsHtml += `<span class="mr-3 ball">${key}<span class="badge badge-primary small ml-1">${megaData[yearLable].megaBall[key]}</span></span>`);

    // Assembling html text
    htmlText += `<div class="d-flex mt-4">
                    <div class="mr-4">${yearLable}</div>
                    <div>
                      <div class="d-flex mb-3"><div class="mr-3">Balls: </div><div>${ballsHtml}</div></div>
                      <div class="d-flex"><div class="mr-3">MegaBalls: </div><div>${megaBallsHtml}</div></div>
                    </div>
                  </div>`;
  });
  return htmlText;
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

function drawCharts() {
  const dataTableArray = [];
  Object.keys(megaObject.all.balls).forEach(key => dataTableArray.push([key * 1, megaObject.all.balls[key], megaObject['2018'].balls[key] ? megaObject['2018'].balls[key] : 0]));
  const data = new google.visualization.DataTable();
  data.addColumn('number', 'Balls number');
  data.addColumn('number', 'All year');
  data.addColumn('number', '2018');
  data.addRows(dataTableArray);
  const options = {
    title: 'Mega balls winning number for all data',
    // hAxis: {title: 'Balls number', minValue: 1, maxValue: 80},
    // vAxis: {title: 'Winning amount', minValue: 0, maxValue: 100},
    // legend: 'none',
    series: {
            0: {targetAxisIndex: 0},
            1: {targetAxisIndex: 1}
          },
    vAxes: {
      // Adds titles to each axis.
      0: {title: 'All year'},
      1: {title: '2018'}
    }
  };

  const ballsChart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

  ballsChart.draw(data, options);

  dataTableArray.length = 0;
  Object.keys(megaObject.all.megaBall).forEach(key => dataTableArray.push([key * 1, megaObject.all.megaBall[key], megaObject['2018'].megaBall[key] ? megaObject['2018'].megaBall[key] : 0]));
  // console.log(dataTableArray);
  const megaData = new google.visualization.DataTable();
  megaData.addColumn('number', 'MegaBall number');
  megaData.addColumn('number', 'All year');
  megaData.addColumn('number', '2018');
  megaData.addRows(dataTableArray);
  const megaOptions = {
    title: 'Mega balls winning number for all data',
    // hAxis: {title: 'Balls number', minValue: 1, maxValue: 80},
    // vAxis: {title: 'Winning amount', minValue: 0, maxValue: 100},
    // legend: 'none',
    series: {
            0: {targetAxisIndex: 0},
            1: {targetAxisIndex: 1}
          },
    vAxes: {
      // Adds titles to each axis.
      0: {title: 'All year'},
      1: {title: '2018'}
    }
  };

  const megaBallsChart = new google.visualization.ScatterChart(document.getElementById('mega_chart_div'));

  megaBallsChart.draw(megaData, megaOptions);


}

/**
 * If the Mage data has already been fetched and stored in the localStorage, analyze them directly.
 * Otherwise, fetch all data and store in the localStorage.
 */
$(document).ready(() => {
  megaObject = analyze(getMegaDataArray(megaData));
  const htmlText = generateHtmlText(megaObject);
  $('#showDiv').html(htmlText);
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawCharts);
});
