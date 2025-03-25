function softmax(arr) {
    const max = Math.max(...arr); // For numerical stability
    const expArr = arr.map(x => Math.exp(x - max)); // Subtract max for stability
    const sum = expArr.reduce((acc, curr) => acc + curr, 0);
    return expArr.map(x => x / sum); // Normalize to get probabilities
}

async function runModel() {
    try {
        document.getElementById('loader').style.display = "grid"
        document.getElementById('classifier').style.display =  'none'
        const session = await ort.InferenceSession.create('./cnn_model.onnx');

        const fileInput = document.getElementById('imageInput').files[0];
        if (!fileInput) {
            alert('Please select an image.');
            return;
        }

        // Preprocess image (grayscale + resize)
        const imageData = await preprocessImage(fileInput);

        // Prepare input for ONNX model
        const feeds = { input: new ort.Tensor('float32', imageData, [1, 1, 256, 256]) };

        // Run the model
        const results = await session.run(feeds);

        // Display output
        const softmaxResult = softmax(results.output.data);
        console.log(softmaxResult)
        const roundedOutput = softmaxResult.map(value => Math.round(value * 100) / 100);

        let sum = 0;
        let warning = 0;
        for (let i = 0; i < roundedOutput.length; i++) {
            sum += roundedOutput[i];
        }
        if(sum != 1){
            warning = "(Warning! More than one class possible.)" 
        }
        const maxValue = Math.max(...roundedOutput);
        const maxIndex = roundedOutput.indexOf(maxValue);
        const arrClasses = ["Glioma", "Meningioma", "Pituitary", "Healthy"]



        document.getElementById('output').innerText = `${arrClasses[maxIndex]}`;


        if (fileInput && fileInput.type.startsWith('image/')) {
            // Create a FileReader to read the image file
            const reader = new FileReader();
            // Define the onload event to display the image
            reader.onload = function(e) {
                document.getElementById('original_img_preview').src = e.target.result;
            };
            reader.readAsDataURL(fileInput);
        } else {
            alert('Please select a valid image file.');
        }

        document.getElementById('glioma_val').innerHTML = Math.round(results.output.data[0] * 100)/100
        document.getElementById('meningioma_val').innerHTML = Math.round(results.output.data[1] * 100)/100
        document.getElementById('pituitary_val').innerHTML = Math.round(results.output.data[2] * 100)/100
        document.getElementById('healthy_val').innerHTML = Math.round(results.output.data[3] * 100)/100

        document.getElementById('glioma_round').innerHTML = roundedOutput[0]
        document.getElementById('meningioma_round').innerHTML = roundedOutput[1]
        document.getElementById('pituitary_round').innerHTML = roundedOutput[2]
        document.getElementById('healthy_round').innerHTML = roundedOutput[3]

        
        document.getElementById('loader').style.display =  'none'
        document.getElementById('results').style.display = 'block'
        



    } catch (error) {
        console.error('Error running model:', error);
        document.getElementById('output').innerText = 'Error running model!';
    }


}

const ctxCanvas = canvasPreview.getContext('2d');


async function preprocessImage(imageFile) {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return new Promise((resolve) => {
        img.onload = () => {
            canvas.width = 256;
            canvas.height = 256;
            ctx.drawImage(img, 0, 0, 256, 256);

            // Convert to grayscale
            const imageData = ctx.getImageData(0, 0, 256, 256).data;
            const floatArray = new Float32Array(256 * 256);

            for (let i = 0; i < imageData.length; i += 4) {
                // Grayscale formula: Y = 0.299R + 0.587G + 0.114B
                const grayscaleValue = 
                    0.299 * imageData[i] +        // Red
                    0.587 * imageData[i + 1] +    // Green
                    0.114 * imageData[i + 2];     // Blue

                floatArray[i / 4] = grayscaleValue / 255.0;  // Normalize to [0, 1]
            }

            resolve(floatArray);

            const grayscaleCanvas = document.createElement('canvas');
                    const grayscaleCtx = grayscaleCanvas.getContext('2d');
                    grayscaleCanvas.width = 256;
                    grayscaleCanvas.height = 256;
                    const grayscaleImageData = grayscaleCtx.createImageData(256, 256);
                    for (let i = 0; i < floatArray.length; i++) {
                        grayscaleImageData.data[i * 4] = floatArray[i] * 255;     // Red
                        grayscaleImageData.data[i * 4 + 1] = floatArray[i] * 255; // Green
                        grayscaleImageData.data[i * 4 + 2] = floatArray[i] * 255; // Blue
                        grayscaleImageData.data[i * 4 + 3] = 255;                 // Alpha
                    }
                    grayscaleCtx.putImageData(grayscaleImageData, 0, 0);

                    // Display the grayscale image on the canvas
                    canvasPreview.width = 400;
                    canvasPreview.height = 400;
                    ctxCanvas.drawImage(grayscaleCanvas, 0, 0, 400, 400);
        };
        img.src = URL.createObjectURL(imageFile);
    });
}
