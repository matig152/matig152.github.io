// Constants
const N_FFT = 1024; // Number of FFT points
const HOP_LENGTH = 512; // Hop length for STFT
const SAMPLE_RATE = 2000; // Sample rate of the audio (adjust as needed)
const N_MELS = 64; // Number of Mel bands
const SNIPPET_LENGTH = 10
// Inferno colormap (RGB values)
const INFERNO_COLORMAP = [
    [0, 0, 0],       // Black
    [40, 11, 84],    // Dark purple
    [101, 21, 110],  // Purple
    [159, 42, 99],   // Magenta
    [212, 72, 66],   // Red
    [245, 125, 21],  // Orange
    [250, 193, 39],  // Yellow
    [252, 255, 164]  // Bright yellow
  ];

// Function to pad the last dimension of a tensor with zeros
function padLastDimension(tensor, padSize) {
    // Get the current shape of the tensor
    const shape = tensor.dims;
  
    // Calculate the number of zeros to add
    const lastDimSize = shape[shape.length - 1];
    const zerosToAdd = Math.max(0, padSize - lastDimSize);
  
    // If no padding is needed, return the original tensor
    if (zerosToAdd <= 0) {
      return tensor;
    }
  
    // Calculate the total number of elements in the new tensor
    const totalElements = shape.slice(0, -1).reduce((a, b) => a * b, 1) * padSize;
  
    // Create a new array to hold the padded data
    const paddedData = new Float32Array(totalElements);
  
    // Copy the original data into the new array
    paddedData.set(tensor.data);
  
    // Fill the remaining positions with zeros
    for (let i = tensor.data.length; i < totalElements; i++) {
      paddedData[i] = 0;
    }
  
    // Create a new shape with the padded last dimension
    const newShape = [...shape.slice(0, -1), padSize];
  
    // Create a new tensor with the padded data and shape
    const paddedTensor = new ort.Tensor(tensor.type, paddedData, newShape);
  
    return paddedTensor;
  }

async function runModel(){
  file = document.getElementById('fileInput').files[0]
  if(!file){alert("Please provide a wav file."); return;}
  document.getElementById('classifier').style.display = 'None'
  document.getElementById('loader').style.display = "grid"

  // PARSE WAV FILE
  const reader = new FileReader();
  reader.onload = function(e){
    const arrayBuffer = e.target.result;
    const audioData = parseWAV(arrayBuffer);

    // Example usage
    // console.log(audioData['data'])

    let melSpectrogram = computeMelSpectrogram(Array.from(audioData['data']), SAMPLE_RATE, N_FFT, HOP_LENGTH, N_MELS);
    // console.log(melSpectrogram); // The computed Mel spectrogram

    // console.log(melSpectrogram)

    // UTWÓRZ TENSOR
    const flatData = melSpectrogram.flat()
    let tensor = new ort.Tensor('float32', Float32Array.from(flatData), [
      1, // Batch size
      melSpectrogram[0].length, // Number of Mel bands
      melSpectrogram.length // Number of frames
    ]);
    if (tensor.dims[2] < 40){
        tensor = padLastDimension(tensor, 40)
    }
    else if (tensor.dims[2] > 40){
        tensor = truncateLastDimension(tensor, 40)
    }
    const newShape = [1, ...tensor.dims]
    tensor = new ort.Tensor(tensor.type, tensor.data, newShape)
    // RUN INFERENCE
    results = runInference(tensor).then(results =>{
        // console.log(results.output['data'])

        softmaxRes = softmax(results.output['data']) 
        
        outputP = document.getElementById('output')
        if(softmaxRes[1] > softmaxRes[0]){outputP.innerHTML = "Abnormal"}
        if(softmaxRes[0] > softmaxRes[1]){outputP.innerHTML = "Normal"}

        document.getElementById('normal_val').innerHTML = Math.round(results.output['data'][0] * 1000) / 1000
        document.getElementById('abnormal_val').innerHTML = Math.round(results.output['data'][1] * 1000) / 1000
        document.getElementById('normal_round').innerHTML = Math.round(softmaxRes[0] * 1000) / 1000
        document.getElementById('abnormal_round').innerHTML = Math.round(softmaxRes[1] * 1000) / 1000
        
        const canvas = document.getElementById('melSpectrogramCanvas');
        const epsilon = 1e-10;  
        melSpectrogram = melSpectrogram.map(frame => 
            frame.map(value => Math.log(value + epsilon))  // Natural log (ln)
        );
        melSpectrogram = normalizeMelSpectrogram(melSpectrogram);
        renderMelSpectrogram(canvas, melSpectrogram);
        
      document.getElementById('loader').style.display = "none"
      document.getElementById('results').style.display = 'block'
    })
    }
  reader.readAsArrayBuffer(file);
}

function softmax(vector) {
    // Compute the exponentials of each element
    const expVector = vector.map((x) => Math.exp(x));
  
    // Compute the sum of exponentials
    const sumExp = expVector.reduce((a, b) => a + b, 0);
  
    // Compute the softmax values
    const softmaxVector = expVector.map((exp) => exp / sumExp);
  
    return softmaxVector;
}

async function runInference(tensor) {
    const session = await ort.InferenceSession.create('cnn_model.onnx');
    const inputs = { input: tensor }; // Replace 'input' with the input name of your model
    const results = await session.run(inputs);
    // console.log('Inference Results:', results);
    return results
}

function renderMelSpectrogram(canvas, melSpectrogram) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const numFrames = melSpectrogram.length;
    const numBands = melSpectrogram[0].length;
  
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
  
    // Draw the heatmap
    for (let t = 0; t < numFrames; t++) {
      for (let f = 0; f < numBands; f++) {
        const value = melSpectrogram[t][f];
        const x = (t / numFrames) * width;
        const y = ((numBands - f - 1) / numBands) * height;
        const rectWidth = width / numFrames;
        const rectHeight = height / numBands;
  
        // Map the value to a color
        const color = getColor(value);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, rectWidth, rectHeight);
      }
    }
}
  
function getColor(value) {
    const index = Math.floor(value * (INFERNO_COLORMAP.length - 1));
    const [r1, g1, b1] = INFERNO_COLORMAP[index];
    const [r2, g2, b2] = INFERNO_COLORMAP[index + 1] || INFERNO_COLORMAP[index];
    const t = value * (INFERNO_COLORMAP.length - 1) - index;
  
    const r = Math.floor(r1 + t * (r2 - r1));
    const g = Math.floor(g1 + t * (g2 - g1));
    const b = Math.floor(b1 + t * (b2 - b1));
  
    return `rgb(${r}, ${g}, ${b})`
}
  
function parseWAV(arrayBuffer) {
    const dataView = new DataView(arrayBuffer);
    let offset = 0;
  
    // Read the RIFF header
    const chunkID = String.fromCharCode(...[dataView.getUint8(offset), dataView.getUint8(offset + 1), dataView.getUint8(offset + 2), dataView.getUint8(offset + 3)]);
    offset += 4;
    const chunkSize = dataView.getUint32(offset, true);
    offset += 4;
    const format = String.fromCharCode(...[dataView.getUint8(offset), dataView.getUint8(offset + 1), dataView.getUint8(offset + 2), dataView.getUint8(offset + 3)]);
    offset += 4;
  
    if (chunkID !== 'RIFF' || format !== 'WAVE') {
      throw new Error('Not a valid WAV file');
    }
  
    // Read sub-chunks
    let fmtChunk, dataChunk;
    while (offset < dataView.byteLength) {
      const subChunkID = String.fromCharCode(...[dataView.getUint8(offset), dataView.getUint8(offset + 1), dataView.getUint8(offset + 2), dataView.getUint8(offset + 3)]);
      offset += 4;
      const subChunkSize = dataView.getUint32(offset, true);
      offset += 4;
  
      if (subChunkID === 'fmt ') {
        // Parse fmt chunk
        fmtChunk = {
          audioFormat: dataView.getUint16(offset, true),
          numChannels: dataView.getUint16(offset + 2, true),
          sampleRate: dataView.getUint32(offset + 4, true),
          byteRate: dataView.getUint32(offset + 8, true),
          blockAlign: dataView.getUint16(offset + 12, true),
          bitsPerSample: dataView.getUint16(offset + 14, true)
        };
        offset += subChunkSize;
      } else if (subChunkID === 'data') {
        // Parse data chunk
        dataChunk = new Int16Array(arrayBuffer, offset, subChunkSize / 2);
        const normalizedData = Float32Array.from(dataChunk, sample => sample / 32768);
        offset += subChunkSize;
        dataChunk = normalizedData.slice(0, fmtChunk.sampleRate * SNIPPET_LENGTH);
      } else {
        // Skip other chunks
        offset += subChunkSize;
      }
    }
  
    if (!fmtChunk || !dataChunk) {
      throw new Error('Invalid WAV file: Missing fmt or data chunk');
    }
  
    return {
      format: fmtChunk,
      data: dataChunk
    };
}

function hzToMel(hz, melScale = "htk") {
    if (melScale === "htk") {
      return 2595 * Math.log(1 + hz / 700);
    } else if (melScale === "slaney") {
      const f_min = 0.0;
      const f_sp = 200.0 / 3;
      const min_log_hz = 1000.0;
      const min_log_mel = (min_log_hz - f_min) / f_sp;
      const logstep = Math.log(6.4) / 27.0;
  
      if (hz >= min_log_hz) {
        return min_log_mel + Math.log(hz / min_log_hz) / logstep;
      } else {
        return (hz - f_min) / f_sp;
      }
    } else {
      throw new Error(`Unknown mel scale: ${melScale}`);
    }
  }
  
  
function melToHz(mel, melScale = "htk") {
    if (melScale === "htk") {
      return 700 * (Math.exp(mel / 2595) - 1);
    } else if (melScale === "slaney") {
      const f_min = 0.0;
      const f_sp = 200.0 / 3;
      const min_log_hz = 1000.0;
      const min_log_mel = (min_log_hz - f_min) / f_sp;
      const logstep = Math.log(6.4) / 27.0;
  
      if (mel >= min_log_mel) {
        return min_log_hz * Math.exp(logstep * (mel - min_log_mel));
      } else {
        return f_min + f_sp * mel;
      }
    } else {
      throw new Error(`Unknown mel scale: ${melScale}`);
    }
}
  
function createTriangularFilterBank(allFreqs, fPts) {
    const nFreqs = allFreqs.length;
    const nFilters = fPts.length - 2;
    const fb = Array.from({ length: nFreqs }, () => new Array(nFilters).fill(0));
  
    for (let i = 0; i < nFilters; i++) {
      const left = fPts[i];
      const center = fPts[i + 1];
      const right = fPts[i + 2];
  
      for (let j = 0; j < nFreqs; j++) {
        const freq = allFreqs[j];
        if (freq >= left && freq <= center) {
          fb[j][i] = (freq - left) / (center - left);
        } else if (freq > center && freq <= right) {
          fb[j][i] = (right - freq) / (right - center);
        }
      }
    }
  
    return fb;
}
  
function melscaleFbanks(nFreqs, fMin, fMax, nMels, sampleRate, norm = null, melScale = "htk") {
    if (norm !== null && norm !== "slaney") {
      throw new Error('norm must be null or "slaney"');
    }
  
    // Generate linearly spaced frequency bins
    const allFreqs = Array.from({ length: nFreqs }, (_, i) => (i * sampleRate) / (2 * (nFreqs - 1)));
  
    // Convert min and max frequencies to Mel scale
    const mMin = hzToMel(fMin, melScale);
    const mMax = hzToMel(fMax, melScale);
  
    // Generate Mel-spaced points
    const mPts = Array.from({ length: nMels + 2 }, (_, i) => mMin + (i * (mMax - mMin)) / (nMels + 1));
    const fPts = mPts.map((mel) => melToHz(mel, melScale));
  
    // Create triangular filter bank
    let fb = createTriangularFilterBank(allFreqs, fPts);
  
    // Normalize if using Slaney's method
    if (norm === "slaney") {
      const enorm = fPts.slice(2, nMels + 2).map((f, i) => 2.0 / (f - fPts[i]));
      fb = fb.map((row) => row.map((val, i) => val * enorm[i]));
    }
    return fb;
}

function hannWindow(size) {
    return Array.from({ length: size }, (_, n) =>
        0.5 * (1 - Math.cos((2 * Math.PI * n) / (size - 1)))
    );
}

function zeroPad(signal, pad) {
    return [
        ...Array(pad).fill(0),
        ...signal,
        ...Array(pad).fill(0)
    ];
}

function naiveFFT(signal) {
    const N = signal.length;
    const result = [];
  
    for (let k = 0; k < N; k++) {
        let real = 0;
        let imag = 0;
  
        for (let n = 0; n < N; n++) {
            const angle = (-2 * Math.PI * k * n) / N;
            real += signal[n] * Math.cos(angle);
            imag += signal[n] * Math.sin(angle);
        }
  
        result.push({ re: real, im: imag });
    }
  
    return result;
  }

function stft(signal, n_fft = 400, win_length = null, hop_length = null, pad = 0, power = 2) {
    win_length = win_length || n_fft;
    hop_length = hop_length || Math.floor(win_length / 2);

    const window = hannWindow(win_length);
    const paddedSignal = zeroPad(signal, pad);

    const numFrames = Math.floor((paddedSignal.length - win_length) / hop_length) + 1;
    const spectrogram = [];

    for (let i = 0; i < numFrames; i++) {
        const start = i * hop_length;
        const frame = paddedSignal.slice(start, start + win_length);
        const windowedFrame = frame.map((val, idx) => val * window[idx]);

        // FFT implementation (basic naive DFT)
        const fft = naiveFFT(windowedFrame);
        const magnitudes = fft.slice(0, n_fft / 2 + 1).map(c => Math.sqrt(c.re ** 2 + c.im ** 2));

        if (power !== null) {
            spectrogram.push(magnitudes.map(mag => mag ** power));
        } else {
            spectrogram.push(fft.slice(0, n_fft / 2 + 1)); // Complex STFT result
        }
    }

    return spectrogram;
}

function normalizeMelSpectrogram(melSpectrogram) {
    const min = Math.min(...melSpectrogram.flat());
    const max = Math.max(...melSpectrogram.flat());
    return melSpectrogram.map((frame) =>
      frame.map((x) => (x - min) / (max - min))
    );
  }

function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

function computeMelSpectrogram(signal, sampleRate, nFft, hopLength, nMel) {
    const melFilterBank = melscaleFbanks(N_FFT / 2 + 1, 0, SAMPLE_RATE / 2, N_MELS, SAMPLE_RATE, norm = null, melScale = "htk")

    const spectrogram = stft(signal, N_FFT, N_FFT, HOP_LENGTH, 500)

    // console.log(melFilterBank)
    // console.log(spectrogram)

    let melSpectrogram = transpose(melFilterBank).map(melFilter =>
        spectrogram.map(frame =>
            frame.reduce((sum, mag, idx) => sum + mag * melFilter[idx], 0)
        )
    );

    console.log(melSpectrogram)
    return transpose(melSpectrogram)
}
