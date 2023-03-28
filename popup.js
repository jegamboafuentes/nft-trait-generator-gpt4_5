const apiKey = "AIzaSyDUYrOx0r7spBBltBDthXu_zwWzk2LKUA4";
const annotationsContainer = document.getElementById("annotations");
const statusElement = document.getElementById("status-text");

chrome.runtime.sendMessage({ type: "getImageUrl" }, (response) => {
    if (response.imageUrl) {
        setStatus(2, response.imageUrl); // Image loaded

        annotateImage(response.imageUrl)
            .then((annotations) => {
                if (annotations.labelAnnotations && annotations.labelAnnotations.length > 0) {
                    setStatus(4, response.imageUrl); // Displaying results
                } else {
                    setStatus(3); // Waiting
                }

                // Save annotations to chrome.storage.local
                chrome.storage.local.set({ annotations: annotations.labelAnnotations });
                chrome.storage.local.set({ gcpResponse: annotations });

                displayAnnotations(annotations.labelAnnotations);
            })
            .catch((error) => {
                console.error(error);
                annotationsContainer.innerHTML = "Error: Failed to fetch annotations.";
            });
    } else {
        setStatus(1); // Image not loaded
    }
});

async function annotateImage(imageUrl) {
    console.log('IN GCP VISON REST CALL FUNCTION')
    console.log('image to analyze')
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
                        maxResults: 20,
                    },
                    {
                        type: "IMAGE_PROPERTIES",
                        maxResults: 20,
                    },
                ],
            },
        ],
    };

    let retries = 50;
    let annotations;
    let gcpApiVisionResponse;

    while (retries > 0) {
        console.log('in while')
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('debuging');
        gcpApiVisionResponse = data.responses[0];
        annotations = data.responses[0].labelAnnotations;



        if (annotations && annotations.length > 0) {
            break;
        } else {
            retries--;
            if (retries > 0) {
                setStatus(3); // Waiting
            }
        }
    }

    return gcpApiVisionResponse;
}

function displayAnnotations(annotations) {
    // ... (Existing code)

    if (annotations && annotations.length > 0) {
        const list = document.createElement("ul");
        annotations.slice(0,5).forEach((annotation) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${annotation.description} (${(annotation.score * 100).toFixed(2)}%)`;
            list.appendChild(listItem);
        });
        annotationsContainer.appendChild(list);
    } else {
        annotationsContainer.innerHTML = "No annotations found.";
    }

    const actionsContainer = document.getElementById("actions");
    actionsContainer.style.display = "block";
}

function setStatus(status, img) {
    const statusImage = document.getElementById("status-image");

    switch (status) {
        case 1:
            statusElement.textContent = "Status: Image not loaded";
            statusImage.src = "images/project.png";
            break;
        case 2:
            statusElement.textContent = "Processing this image:";
            statusImage.src = img;
            break;
        case 3:
            statusElement.textContent = "Status: Waiting (this can take a minute)";
            statusImage.src = "images/pixel5.png";
            break;
        case 4:
            statusElement.textContent = "Results (sample):";
            statusImage.src = img;
            break;
        default:
            statusElement.textContent = "Status: Unknown";
            statusImage.src = img//"images/unknown.png";
    }
}

document.getElementById('openSeaLevels_button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoOpenSeaLevels' });
    });
});

document.getElementById('openSeaStats_button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoOpenSeaStats' });
    });
});
