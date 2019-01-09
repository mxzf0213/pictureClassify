// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ML5 Example
Simple Image Classification Drag and Drop
=== */


const image = document.getElementById('image'); // The image we want to classify
const dropContainer = document.getElementById('container');
const warning = document.getElementById('warning');
const fileInput = document.getElementById('fileUploader');

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
};

function windowResized() {
  let windowW = window.innerWidth;
  if (windowW < 480 && windowW >= 200) {
    image.style.maxWidth = windowW - 80;
    dropContainer.style.display = 'block';
  } else if (windowW < 200) {
    dropContainer.style.display = 'none';
  } else {
    image.style.maxWidth = '90%';
    dropContainer.style.display = 'block';
  }
}

['dragenter', 'dragover'].forEach(eventName => {
  dropContainer.addEventListener(eventName, e => dropContainer.classList.add('highlight'), false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, e => dropContainer.classList.remove('highlight'), false)
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, preventDefaults, false)
});

dropContainer.addEventListener('drop', gotImage, false)

function gotImage(e) {

  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 1) {
    console.error('upload only one file');
  }
  const file = files[0];
  const imageType = /image.*/;
  if (file.type.match(imageType)) {
    warning.innerHTML = '';
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      image.src = reader.result;
      setTimeout(classifyImage, 100);
    }
  } else {
    image.src = './bird.jpg';
    setTimeout(classifyImage, 100);
    warning.innerHTML = 'Please drop an image file.'
  }
}

function handleFiles() {
  const curFiles = fileInput.files;
  if (curFiles.length === 0) {
    image.src = './bird.jpg';
    setTimeout(classifyImage, 100);
    warning.innerHTML = 'No image selected for upload';
  } else {
    image.src = window.URL.createObjectURL(curFiles[0]);
    warning.innerHTML = '';
    setTimeout(classifyImage, 100);
  }
}

function clickUploader() {
  fileInput.click();
}

const result = document.getElementById('result'); // The result tag in the HTML
const probability = document.getElementById('probability'); // The probability tag in the HTML

const state = document.getElementById('isLoading');
// Initialize the Image Classifier method
const classifier = ml5.imageClassifier('Mobilenet', () => {
    state.innerText = "Model Loaded!";
 });

// Make a prediction with the selected image
// This will return an array with a default of 10 options with their probabilities
classifyImage();

function setTable(top3, probs) {
  for (var i = 0; i < top3.length; i++) {
      let sym = document.getElementById('sym' + (i + 1))
      let prob = document.getElementById('prob' + (i + 1))
      sym.innerHTML = top3[i]
      prob.innerHTML = probs[i]
  }
  createPie(".pieID.legend", ".pieID.pie");
}

function classifyImage() {
  classifier.predict(image, (err, results) => {
    let resultTxt = results[0].className;
    result.innerText = resultTxt;
    let prob = 100 * results[0].probability;
    probability.innerText = Number.parseFloat(prob).toFixed(2) + '%';

    //set table
    var top3 = [];
    var probs = [];
    for(var i=0; i<3 ;i++)
    {
        top3[i] = results[i].className.split(',')[0];
        let prob = 100 * results[i].probability;
        probs[i] = Number.parseFloat(prob).toFixed(3);
    }
    setTable(top3, probs);
  });
}
