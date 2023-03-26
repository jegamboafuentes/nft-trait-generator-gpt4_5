chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'insertDataIntoOpenSeaLevels') {
    chrome.storage.local.get('annotations', (data) => {
      if (data.annotations) {
        const gcpResponse = data.annotations;
        openSeaLevels(gcpResponse);
        //sendResponse({ status: "Success!" });
        openSeaLevels(gcpResponse);
      } else {
        console.error('No annotations found in storage');
        //sendResponse({ status: "Exception occurred!" });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'insertDataIntoOpenSeaStats') {
    chrome.storage.local.get('annotations', (data) => {
      if (data.annotations) {
        const gcpResponse = data.annotations.imagePropertiesAnnotation.dominantColors;
        //openSeaLevels(gcpResponse);
        //sendResponse({ status: "Success!" });
        //openSeaLevels(gcpResponse);
      } else {
        console.error('No annotations found in storage');
        //sendResponse({ status: "Exception occurred!" });
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
