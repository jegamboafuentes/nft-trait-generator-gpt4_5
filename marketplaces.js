//OpenSea button call 1
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'insertDataIntoOpenSeaLevels') {
    chrome.storage.local.get('annotations', (data) => {
      if (data.annotations) {
        const gcpResponse = data.annotations;
        //penSeaLevels(gcpResponse) need to be executed 2 times, dont know why 
        openSeaLevels(gcpResponse);
        openSeaLevels(gcpResponse);
      } else {
        console.error('insertDataIntoOpenSeaLevels No annotations found in storage');
      }
    });
  }
});

//OpenSea button call 2
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'insertDataIntoOpenSeaStats') {
    chrome.storage.local.get('gcpResponse', (data) => {
      console.log(data);
      if (data.gcpResponse.imagePropertiesAnnotation) {
        //openSeaStats(gcpResponse) need to be executed 2 times, dont know why 
        openSeaStats(data.gcpResponse)
        openSeaStats(data.gcpResponse)
      } else {
        console.error('insertDataIntoOpenSeaStats No annotations found in storage');
      }
    });
  }
});

//Manifold button call 1
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'insertDataIntoManifoldTraits1') {
    chrome.storage.local.get('gcpResponse', (data) => {
      //console.log(data);
      if (data.gcpResponse.imagePropertiesAnnotation) {
        //openSeaStats(gcpResponse) need to be executed 2 times, dont know why 
        //openSeaStats(data.gcpResponse)
        //openSeaStats(data.gcpResponse)
        manifoldTrait1(data.gcpResponse);
      } else {
        console.error('insertDataIntoOpenSeaStats No annotations found in storage');
      }
    });
  }
});


//Inject GCP response into OpenSea Leveks
function openSeaLevels(gcpResponse) {
  console.log('openSeaLevels');
  try {
    var t = document.querySelector('table');
    var htmlTableList = t.getElementsByTagName("tr");
    var noOfRowsOnTableClient = (htmlTableList.length) - 1;

    for (var i = 0; i < noOfRowsOnTableClient; i++) {
      typeIvalue = gcpResponse[i].description;
      nameIvalue = gcpResponse[i].score;
      htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').value = typeIvalue;
      htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').dispatchEvent(new Event('input', {
        'bubbles': true
      }))
      htmlTableList[i + 1].querySelector('input[placeholder="Min"]').value = parseInt(nameIvalue * 100);
      htmlTableList[i + 1].querySelector('input[placeholder="Min"]').dispatchEvent(new Event('input', {
        'bubbles': true
      }))
      htmlTableList[i + 1].querySelector('input[placeholder="Max"]').value = 100
      htmlTableList[i + 1].querySelector('input[placeholder="Max"]').dispatchEvent(new Event('input', {
        'bubbles': true
      }))
    };
    console.log('openSeaLevels data injected in opensea field');
  } catch (error) {
    console.log(error)
  }
}

//Inject GCP response into OpenSea stats
function openSeaStats(gcpResponse) {
  console.log('openSeaStats');
  try {
    var t = document.querySelector('table');
    var htmlTableList = t.getElementsByTagName("tr");
    var noOfRowsOnTableClient = (htmlTableList.length) - 1;

    var colorList = [];
    percentageList = [];
    sumColorScores = 0;
    for (var i = 0; i < noOfRowsOnTableClient; i++) {
      sumColorScores = sumColorScores + gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].score;
    }
    for (var i = 0; i < noOfRowsOnTableClient; i++) {
      perc = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].score / sumColorScores;
      percentageList.push(perc);
    }

    for (var i = 0; i < noOfRowsOnTableClient; i++) {
      typeIvalue = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i];
      myR = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.red;
      myG = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.green;
      myB = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.blue;
      hexColor = rgbToHex(myR, myG, myB);

      nameIvalue = gcpResponse.labelAnnotations[i].score;

      htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').value = hexColor;//"PUTOS";request.type;
      htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').dispatchEvent(new Event('input', {
        'bubbles': true
      }))
      htmlTableList[i + 1].querySelector('input[placeholder="Min"]').value = parseInt(percentageList[i] * 100);//request.name;
      htmlTableList[i + 1].querySelector('input[placeholder="Min"]').dispatchEvent(new Event('input', {
        'bubbles': true
      }))
      htmlTableList[i + 1].querySelector('input[placeholder="Max"]').value = 100
      htmlTableList[i + 1].querySelector('input[placeholder="Max"]').dispatchEvent(new Event('input', {
        'bubbles': true
      }))
      console.log('hey! printing values: ' + i);
      console.log(typeIvalue);
      console.log(nameIvalue)
    };
  } catch (error) {
    console.log(error)
  }
}

//Part of 'openSeaStats' 
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

//Part of 'openSeaStats' 
function rgbToHex(r, g, b) {
  console.log("#" + componentToHex(r) + componentToHex(g) + componentToHex(b))
  return "colorRatio:#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//Inject GCP response into Manifold Traits1
function manifoldTrait1(gcpResponse) {
  console.log('manifoldTrait1');
  console.log(gcpResponse);
  try {
    //var t = document.querySelector('property-list');
    var t = document.getElementById("property-list");
    console.log('hey, sup!, here the t:');
    console.log(t);

    var htmlTableList = t.getElementsByClassName("flex items-center py-2 border-b-2 list-el");
    console.log(htmlTableList);

    //var noOfRowsOnTableClient = (htmlTableList.length) - 1;
    nfieldsUsed = 0;
    for (var i = 0; i < htmlTableList.length; i++) {
      typeIvalue = gcpResponse.labelAnnotations[i].description;
      nameIvalue = gcpResponse.labelAnnotations[i].score;
      console.log("htmlTableList[i]:" + i);
      console.log(htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value);
      if (htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value) {
        //htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value = htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value;
        nfieldsUsed = nfieldsUsed + 1;
      } else {
        typeIvalue = gcpResponse.labelAnnotations[i - nfieldsUsed].description;
        nameIvalue = gcpResponse.labelAnnotations[i - nfieldsUsed].score;
        htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value = typeIvalue;
        htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').dispatchEvent(new Event('input', {
          'bubbles': true
        }));
        htmlTableList[i].querySelector('input[placeholder="Value"]').value = nameIvalue;
        htmlTableList[i].querySelector('input[placeholder="Value"]').dispatchEvent(new Event('input', {
          'bubbles': true
        }));
      }
    }
    console.log('openSeaLevels data injected in opensea field');
  } catch (error) {
    console.log(error)
  }
}