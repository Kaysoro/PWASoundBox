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
          var theme = sound1[1].theme.localeCompare(sound2[1].theme)
          return theme === 0 ? sound1[1].name.localeCompare(sound2[1].name) : theme;
        });
        soundBox.forEach(function(sound){
          var soundDiv = document.createElement('div');
            soundDiv.innerText = sound[1].name;
            soundDiv.classList.add('sound');
            soundDiv.classList.add(sound[1].theme);
            soundDiv.setAttribute("onclick", "new Audio('" + window.URL.createObjectURL(sound[0]) + "').play();");
            soundDiv.style.backgroundColor = "#"+((1<<24)*Math.random()|0).toString(16);
            box.appendChild(soundDiv);
        });
      }
    });
  });
};

let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});
