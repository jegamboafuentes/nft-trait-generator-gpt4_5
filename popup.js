const apiKey = "AIzaSyDUYrOx0r7spBBltBDthXu_zwWzk2LKUA4";
const annotationsContainer = document.getElementById("annotations");
const statusElement = document.getElementById("status");

chrome.runtime.sendMessage({ type: "getImageUrl" }, (response) => {
    if (response.imageUrl) {
        setStatus(2); // Image loaded

        annotateImage(response.imageUrl)
            .then((annotations) => {
                if (annotations && annotations.length > 0) {
                    setStatus(4); // Displaying results
                } else {
                    setStatus(3); // Waiting
                }

                // Save annotations to chrome.storage.local
                // chrome.storage.local.set({ annotations: annotations }).then(() => {
                //     console.log("Value is set (saved) to " + annotations);
                //   });
                console.log('jegf');
                console.log(chrome.storage);
                //chrome.storage.session.set({ annotations: annotations });
                displayAnnotations(annotations);
            })
            .catch((error) => {
                console.log(error);
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
                        maxResults: 10,
                    },
                ],
            },
        ],
    };

    let retries = 50;
    let annotations;

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

function setStatus(status) {
    switch (status) {
        case 1:
            statusElement.textContent = "Status: Image not loaded";
            break;
        case 2:
            statusElement.textContent = "Status: Image loaded";
            break;
        case 3:
            statusElement.textContent = "Status: Waiting";
            break;
        case 4:
            statusElement.textContent = "Status: Displaying results";
            break;
        default:
            statusElement.textContent = "Status: Unknown";
    }
}
