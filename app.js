// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/PWASoundBox/sw.js', { scope: '/PWASoundBox/' }).then(function(reg) {

    if(reg.installing) {
      console.log('SoundBox SW installing');
    } else if(reg.waiting) {
      console.log('SoundBox SW installed');
    } else if(reg.active) {
      console.log('SoundBox SW active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

// function for loading each image via XHR

function soundLoad(soundJSON) {
  // return a promise for an image loading
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', soundJSON.url);
    request.responseType = 'blob';

    request.onload = function() {
      if (request.status == 200) {
        var arrayResponse = [];
        arrayResponse[0] = request.response;
        arrayResponse[1] = soundJSON;
        resolve(arrayResponse);
      } else {
        reject(Error('Sound didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function() {
      reject(Error('There was a network error.'));
    };

    // Send the request
    request.send();
  });
}

var box = document.getElementById('box');

window.onload = function() {

  // load each set of image, alt text, name and caption
  var soundBox = [];
  Sounds.sounds.forEach(function(sound) {
    soundLoad(sound).then(function(arrayResponse) {
      soundBox.push(arrayResponse);
    }, function(Error) {
      console.log(Error);
    }).then(function(){
      if (soundBox.length === Sounds.sounds.length){
        soundBox.sort(function(sound1, sound2){
          return sound1[1].name.localeCompare(sound2[1].name);
        });
        soundBox.forEach(function(sound){
          var soundDiv = document.createElement('div');
            soundDiv.innerText = sound[1].name;
            soundDiv.classList.add('sound');
            soundDiv.setAttribute("onclick", "new Audio('" + window.URL.createObjectURL(sound[0]) + "').play();");
            soundDiv.style.backgroundColor = "#"+((1<<24)*Math.random()|0).toString(16);
            box.appendChild(soundDiv);
        });
      }
    });
  });
};