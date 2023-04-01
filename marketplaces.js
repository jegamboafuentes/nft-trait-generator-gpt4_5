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
    chrome.storage.local.get('annotations', (data) => {
      if (data.annotations) {
        const gcpResponse = data.annotations;
        manifoldTrait1(gcpResponse)
      } else {
        console.error('insertDataIntoManifoldTraits1 No annotations found in storage');
      }
    });
  }
});

//-*-*-/-*-*-/-*-*-/-*-*-/-> TEST 2
//testInjection
//Manifold button 1
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'insertDataIntoManifoldTraits1_test') {
    chrome.storage.local.get('gcpResponse', (data) => {
      if (data) {
        manifoldTrait1_test(data)
      } else {
        console.error('insertDataIntoManifoldTraits1_test No annotations found in storage');
      }
    });
  }
});

//Manifold button 2 (vlues)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'insertDataIntoManifoldTraits2_test') {
    chrome.storage.local.get('annotations', (data) => {
      if (data.annotations) {
        const gcpResponse = data.annotations;
        manifoldTrait2_test(gcpResponse)
      } else {
        console.error('insertDataIntoManifoldTraits1_test No annotations found in storage');
      }
    });
  }
});
//-*-*-/-*-*-/-*-*-/-*-*-/-> END TEST



//Inject GCP response into OpenSea Levels
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

function manifoldTrait1(gcpResponse) {
  console.log('manifoldTrait1_test');
  console.log(gcpResponse);
  try {
    var t = document.getElementById("property-list");
    console.log('hey, sup!, here the t:');
    console.log(t);

    var htmlTableList = t.getElementsByClassName("flex items-center py-2 border-b-2 list-el");
    console.log("htmlTableList");
    console.log(htmlTableList);

    nfieldsUsed = 0;

    //This for counts the spaces used 
    for (var i = 0; i < htmlTableList.length; i++) {
      let propertyNameInput = htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]');
      if (htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value) {
        nfieldsUsed = nfieldsUsed + 1;
      } else {
        console.log('kike here .. calm down, tu puedes')
        console.log(gcpResponse[0].description)
        htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value = gcpResponse[0].description;
        triggerEvent(propertyNameInput, 'blur');
      }

    }
    nfieldsFree = (htmlTableList.length - nfieldsUsed)
    console.log('field used' + nfieldsUsed);
    console.log('field free' + nfieldsFree);


  } catch (error) {
    console.log(error)
  }
}

function manifoldTrait1_color(gcpResponse) {
  typeIvalueList = [];
  gcpResponse = gcpResponse.gcpResponse;
  console.log('manifoldTrait1_color');//return in a list property name
  try {
    // var t = document.querySelector('table');
    // var htmlTableList = t.getElementsByTagName("tr");
    // var noOfRowsOnTableClient = (htmlTableList.length) - 1;

    var colorList = [];
    percentageList = [];
    sumColorScores = 0;
    nOfRecordsReturnedByApi = 10;
    for (var i = 0; i < nOfRecordsReturnedByApi; i++) {
      sumColorScores = sumColorScores + gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].score;
    }
    for (var i = 0; i < nOfRecordsReturnedByApi; i++) {
      perc = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].score / sumColorScores;
      percentageList.push(perc);
    }

    for (var i = 0; i < nOfRecordsReturnedByApi; i++) {
      typeIvalue = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i];
      myR = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.red;
      myG = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.green;
      myB = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.blue;
      hexColor = rgbToHex(myR, myG, myB);

      nameIvalue = gcpResponse.labelAnnotations[i].score;

      // htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').value = hexColor;//"PUTOS";request.type;
      // htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').dispatchEvent(new Event('input', {
      //   'bubbles': true
      // }))
      // htmlTableList[i + 1].querySelector('input[placeholder="Min"]').value = parseInt(percentageList[i] * 100);//request.name;
      // htmlTableList[i + 1].querySelector('input[placeholder="Min"]').dispatchEvent(new Event('input', {
      //   'bubbles': true
      // }))
      // htmlTableList[i + 1].querySelector('input[placeholder="Max"]').value = 100
      // htmlTableList[i + 1].querySelector('input[placeholder="Max"]').dispatchEvent(new Event('input', {
      //   'bubbles': true
      // }))
      console.log('hey! printing values: ' + i);
      console.log(typeIvalue);
      console.log(nameIvalue);
      typeIvalueList.push(typeIvalue);
    };
  } catch (error) {
    console.log(error)
  }
  //return a map with hex color and score
  return typeIvalueList;
}

//thi works 3/31/23
//-*-*-/-*-*-/-*-*-/-*-*-/-> TEST jegf
function manifoldTrait1_test(gcpResponse) {
  console.log('manifoldTrait1_test JEGF');
  console.log(gcpResponse);
  try {
    var t = document.getElementById("property-list");
    console.log('hey, sup!, here the t:');
    console.log(t);

    var htmlTableList = t.getElementsByClassName("flex items-center py-2 border-b-2 list-el");
    console.log("htmlTableList");
    console.log(htmlTableList);

    nfieldsUsed = 0;
    listOfColors = manifoldTrait1_color(gcpResponse);

    //This for counts the spaces used 
    for (var i = 0; i < htmlTableList.length; i++) {
      let propertyNameInput = htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]');
      if (htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value) {
        nfieldsUsed = nfieldsUsed + 1;
      } else {
        console.log('Enrique here this morning');
        try { //Thius try is for the second annotations after gcp labels run out of responses
          console.log('Enrique @ 12');
          console.log(gcpResponse.annotations);
          htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value = gcpResponse[i].annotations.description;
          triggerEvent(propertyNameInput, 'blur');
        } catch (error) {//catch to add colors <------
          console.log('Enrique here this morning 2');
          htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value = "color + ";//coolors gcpResponse[i].description;
          triggerEvent(propertyNameInput, 'blur');
          //manifoldTrait1_color(gcpResponse);
        }
      }

    }
    nfieldsFree = (htmlTableList.length - nfieldsUsed)
    console.log('field used' + nfieldsUsed);
    console.log('field free' + nfieldsFree);


  } catch (error) {
    console.log(error)
  }
}

function manifoldTrait2_test(gcpResponse) {
  console.log('manifoldTrait2_test JEGF');
  console.log(gcpResponse);
  try {
    var t = document.getElementById("property-list");
    console.log('hey, sup!, here the t:');
    console.log(t);

    var htmlTableList = t.getElementsByClassName("flex items-center py-2 border-b-2 list-el");
    console.log("htmlTableList");
    console.log(htmlTableList);

    nfieldsUsed = 0;



    //This for counts the spaces used 
    for (var i = 0; i < htmlTableList.length; i++) {
      let propertyNameInput = htmlTableList[i].querySelector('input[placeholder="Value"]');
      console.log('Enrique this morning 3');
      console.log(propertyNameInput);
      if (htmlTableList[i].querySelector('input[placeholder="Value"]').value) {
        nfieldsUsed = nfieldsUsed + 1;
      } else {
        // here
        if (htmlTableList[i].querySelector('input[placeholder="Max Value"]')) {
          console.log('enrique 4');
          htmlTableList[i].querySelector('input[placeholder="Max Value"]').value = gcpResponse[i].score;
          triggerEvent(htmlTableList[i].querySelector('input[placeholder="Max Value"]'), 'blur');
        } //end here
        htmlTableList[i].querySelector('input[placeholder="Value"]').value = gcpResponse[i].score;
        triggerEvent(propertyNameInput, 'blur');
      }
    }
    nfieldsFree = (htmlTableList.length - nfieldsUsed)
    console.log('field used' + nfieldsUsed);
    console.log('field free' + nfieldsFree);


  } catch (error) {
    console.log(error)
  }
}
//-*-*-/-*-*-/-*-*-/-*-*-/-> END TEST

//In use of manifoldTrait1 and manifoldTrait2
function triggerEvent(element, eventName) {
  const event = new Event(eventName, { bubbles: true });
  element.dispatchEvent(event);
}
