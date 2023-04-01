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


                console.log("copy paste flat this objcte ");
                console.log(annotations);

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

function generateThumbnail(imageUrl, width, height) {
    const cloudName = 'dqazeznld'; // Replace with your Cloudinary cloud name
    const encodedImageUrl = encodeURIComponent(imageUrl);
    const transformation = `w_${width},h_${height},c_fill`;

    return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformation}/${encodedImageUrl}`;
}


async function annotateImage(imageUrl) {
    console.log('IN GCP VISON REST CALL FUNCTION')
    console.log('original image to analyze: ' + imageUrl)
    imageUrl = generateThumbnail(imageUrl, 500, 500);
    console.log('new image to analyze: ' + imageUrl)
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
                        maxResults: 11,
                    },
                    {
                        type: "IMAGE_PROPERTIES",
                        maxResults: 10,
                    },
                ],
            },
        ],
    };

    let retries = 50;
    let annotations;
    let gcpApiVisionResponse;
    let whileCounter = 0;
    while (retries > 0) {
        console.log('gcp call wrong, try no: ' + whileCounter + ' of: ' + retries + ' retries.');
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

    whileCounter++
    return gcpApiVisionResponse;
}

function displayAnnotations(annotations) {
    // ... (Existing code)

    if (annotations && annotations.length > 0) {
        const list = document.createElement("ul");
        annotations.slice(0, 5).forEach((annotation) => {
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

document.getElementById('manifoldTrait1_button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoManifoldTraits1' });
    });
});

//-*-*-/-*-*-/-*-*-/-*-*-/-> TEST
//test injection
document.getElementById('manifoldTrait1_buttonTest').addEventListener('click', () => {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //     const annotations = "{\"labelAnnotations\":[{\"mid\":\"/m/01bqvp\",\"description\":\"Sky\",\"score\":0.9528408,\"topicality\":0.9528408},{\"mid\":\"/m/0csby\",\"description\":\"Cloud\",\"score\":0.94842356,\"topicality\":0.94842356},{\"mid\":\"/m/02q7ylj\",\"description\":\"Daytime\",\"score\":0.94597495,\"topicality\":0.94597495},{\"mid\":\"/m/05wrt\",\"description\":\"Property\",\"score\":0.9459688,\"topicality\":0.9459688},{\"mid\":\"/m/0d4v4\",\"description\":\"Window\",\"score\":0.9407236,\"topicality\":0.9407236},{\"mid\":\"/m/0cgh4\",\"description\":\"Building\",\"score\":0.8993535,\"topicality\":0.8993535},{\"mid\":\"/m/02rfdq\",\"description\":\"Interiordesign\",\"score\":0.8903511,\"topicality\":0.8903511},{\"mid\":\"/m/019sc6\",\"description\":\"Lighting\",\"score\":0.87413126,\"topicality\":0.87413126},{\"mid\":\"/m/03nfmq\",\"description\":\"Architecture\",\"score\":0.8710872,\"topicality\":0.8710872},{\"mid\":\"/m/0hndl\",\"description\":\"Shade\",\"score\":0.87079966,\"topicality\":0.87079966},{\"mid\":\"/m/0l7_8\",\"description\":\"Floor\",\"score\":0.8285051,\"topicality\":0.8285051},{\"mid\":\"/m/03scnj\",\"description\":\"Line\",\"score\":0.82224584,\"topicality\":0.82224584},{\"mid\":\"/m/023907r\",\"description\":\"Realestate\",\"score\":0.8016695,\"topicality\":0.8016695},{\"mid\":\"/m/020ys5\",\"description\":\"Condominium\",\"score\":0.7951742,\"topicality\":0.7951742},{\"mid\":\"/m/01n32\",\"description\":\"City\",\"score\":0.7912077,\"topicality\":0.7912077},{\"mid\":\"/m/039jq\",\"description\":\"Glass\",\"score\":0.7824242,\"topicality\":0.7824242},{\"mid\":\"/m/01c34b\",\"description\":\"Flooring\",\"score\":0.7814827,\"topicality\":0.7814827},{\"mid\":\"/m/03gfsp\",\"description\":\"Ceiling\",\"score\":0.77877045,\"topicality\":0.77877045},{\"mid\":\"/m/04g3r\",\"description\":\"Leisure\",\"score\":0.77672863,\"topicality\":0.77672863},{\"mid\":\"/m/0j_s4\",\"description\":\"Metropolitanarea\",\"score\":0.77625036,\"topicality\":0.77625036}],\"imagePropertiesAnnotation\":{\"dominantColors\":{\"colors\":[{\"color\":{\"red\":188,\"green\":198,\"blue\":201},\"score\":0.2649216,\"pixelFraction\":0.09057778},{\"color\":{\"red\":162,\"green\":207,\"blue\":220},\"score\":0.097738236,\"pixelFraction\":0.03568889},{\"color\":{\"red\":68,\"green\":83,\"blue\":85},\"score\":0.05645597,\"pixelFraction\":0.08155555},{\"color\":{\"red\":12,\"green\":57,\"blue\":69},\"score\":0.030998783,\"pixelFraction\":0.011155556},{\"color\":{\"red\":189,\"green\":231,\"blue\":244},\"score\":0.050294586,\"pixelFraction\":0.011688889},{\"color\":{\"red\":172,\"green\":206,\"blue\":211},\"score\":0.049110927,\"pixelFraction\":0.0204},{\"color\":{\"red\":110,\"green\":123,\"blue\":129},\"score\":0.049050596,\"pixelFraction\":0.06191111},{\"color\":{\"red\":178,\"green\":206,\"blue\":220},\"score\":0.045739442,\"pixelFraction\":0.024177779},{\"color\":{\"red\":146,\"green\":158,\"blue\":164},\"score\":0.04514534,\"pixelFraction\":0.0772},{\"color\":{\"red\":203,\"green\":232,\"blue\":240},\"score\":0.035901163,\"pixelFraction\":0.0066222223}]}},\"cropHintsAnnotation\":{\"cropHints\":[{\"boundingPoly\":{\"vertices\":[{\"y\":445},{\"x\":1023,\"y\":445},{\"x\":1023,\"y\":1023},{\"y\":1023}]},\"confidence\":0.6291797,\"importanceFraction\":1}]}}"
    //     // console.log(annotations);
    //     chrome.storage.local.set({ gcpResponse: annotations });
    //     chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoManifoldTraits1_test' });
    // });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoManifoldTraits1_test' });
    });

});

document.getElementById('manifoldTrait2_value_buttonTest').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const annotations = "{\"labelAnnotations\":[{\"mid\":\"/m/01bqvp\",\"description\":\"Sky\",\"score\":0.9528408,\"topicality\":0.9528408},{\"mid\":\"/m/0csby\",\"description\":\"Cloud\",\"score\":0.94842356,\"topicality\":0.94842356},{\"mid\":\"/m/02q7ylj\",\"description\":\"Daytime\",\"score\":0.94597495,\"topicality\":0.94597495},{\"mid\":\"/m/05wrt\",\"description\":\"Property\",\"score\":0.9459688,\"topicality\":0.9459688},{\"mid\":\"/m/0d4v4\",\"description\":\"Window\",\"score\":0.9407236,\"topicality\":0.9407236},{\"mid\":\"/m/0cgh4\",\"description\":\"Building\",\"score\":0.8993535,\"topicality\":0.8993535},{\"mid\":\"/m/02rfdq\",\"description\":\"Interiordesign\",\"score\":0.8903511,\"topicality\":0.8903511},{\"mid\":\"/m/019sc6\",\"description\":\"Lighting\",\"score\":0.87413126,\"topicality\":0.87413126},{\"mid\":\"/m/03nfmq\",\"description\":\"Architecture\",\"score\":0.8710872,\"topicality\":0.8710872},{\"mid\":\"/m/0hndl\",\"description\":\"Shade\",\"score\":0.87079966,\"topicality\":0.87079966},{\"mid\":\"/m/0l7_8\",\"description\":\"Floor\",\"score\":0.8285051,\"topicality\":0.8285051},{\"mid\":\"/m/03scnj\",\"description\":\"Line\",\"score\":0.82224584,\"topicality\":0.82224584},{\"mid\":\"/m/023907r\",\"description\":\"Realestate\",\"score\":0.8016695,\"topicality\":0.8016695},{\"mid\":\"/m/020ys5\",\"description\":\"Condominium\",\"score\":0.7951742,\"topicality\":0.7951742},{\"mid\":\"/m/01n32\",\"description\":\"City\",\"score\":0.7912077,\"topicality\":0.7912077},{\"mid\":\"/m/039jq\",\"description\":\"Glass\",\"score\":0.7824242,\"topicality\":0.7824242},{\"mid\":\"/m/01c34b\",\"description\":\"Flooring\",\"score\":0.7814827,\"topicality\":0.7814827},{\"mid\":\"/m/03gfsp\",\"description\":\"Ceiling\",\"score\":0.77877045,\"topicality\":0.77877045},{\"mid\":\"/m/04g3r\",\"description\":\"Leisure\",\"score\":0.77672863,\"topicality\":0.77672863},{\"mid\":\"/m/0j_s4\",\"description\":\"Metropolitanarea\",\"score\":0.77625036,\"topicality\":0.77625036}],\"imagePropertiesAnnotation\":{\"dominantColors\":{\"colors\":[{\"color\":{\"red\":188,\"green\":198,\"blue\":201},\"score\":0.2649216,\"pixelFraction\":0.09057778},{\"color\":{\"red\":162,\"green\":207,\"blue\":220},\"score\":0.097738236,\"pixelFraction\":0.03568889},{\"color\":{\"red\":68,\"green\":83,\"blue\":85},\"score\":0.05645597,\"pixelFraction\":0.08155555},{\"color\":{\"red\":12,\"green\":57,\"blue\":69},\"score\":0.030998783,\"pixelFraction\":0.011155556},{\"color\":{\"red\":189,\"green\":231,\"blue\":244},\"score\":0.050294586,\"pixelFraction\":0.011688889},{\"color\":{\"red\":172,\"green\":206,\"blue\":211},\"score\":0.049110927,\"pixelFraction\":0.0204},{\"color\":{\"red\":110,\"green\":123,\"blue\":129},\"score\":0.049050596,\"pixelFraction\":0.06191111},{\"color\":{\"red\":178,\"green\":206,\"blue\":220},\"score\":0.045739442,\"pixelFraction\":0.024177779},{\"color\":{\"red\":146,\"green\":158,\"blue\":164},\"score\":0.04514534,\"pixelFraction\":0.0772},{\"color\":{\"red\":203,\"green\":232,\"blue\":240},\"score\":0.035901163,\"pixelFraction\":0.0066222223}]}},\"cropHintsAnnotation\":{\"cropHints\":[{\"boundingPoly\":{\"vertices\":[{\"y\":445},{\"x\":1023,\"y\":445},{\"x\":1023,\"y\":1023},{\"y\":1023}]},\"confidence\":0.6291797,\"importanceFraction\":1}]}}"
        // console.log(annotations);
        chrome.storage.local.set({ gcpResponse: annotations });
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoManifoldTraits2_test' });
    });
});


//-*-*-/-*-*-/-*-*-/-*-*-/-> END TEST
