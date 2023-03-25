const apiKey = "AIzaSyDUYrOx0r7spBBltBDthXu_zwWzk2LKUA4";
const annotationsContainer = document.getElementById("annotations");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.imageUrl) {
    annotateImage(request.imageUrl)
      .then((annotations) => {
        displayAnnotations(annotations);
      })
      .catch((error) => {
        console.error(error);
        annotationsContainer.innerHTML = "Error: Failed to fetch annotations.";
      });
  }
});

async function annotateImage(imageUrl) {
  const apiEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const requestBody = {
    requests: [
      {
        image: {
          source: {
            imageUri: imageUrl,
          },
        },
        features: [
          {
            type: "LABEL_DETECTION",
            maxResults: 10,
          },
        ],
      },
    ],
  };

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  const annotations = data.responses[0].labelAnnotations;
  return annotations;
}

function displayAnnotations(annotations) {
  if (annotations && annotations.length > 0) {
    const list = document.createElement("ul");
    annotations.forEach((annotation) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${annotation.description} (${(annotation.score * 100).toFixed(2)}%)`;
      list.appendChild(listItem);
    });
    annotationsContainer.appendChild(list);
  } else {
    annotationsContainer.innerHTML = "No annotations found.";
  }
}
