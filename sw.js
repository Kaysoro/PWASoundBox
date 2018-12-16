self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/PWASoundBox/',
        '/PWASoundBox/index.html',
        '/PWASoundBox/style.css',
        '/PWASoundBox/app.js',
        '/PWASoundBox/sound-list.js',
        '/PWASoundBox/images/icon-72x72.png',
        '/PWASoundBox/images/icon-96x96.png',
        '/PWASoundBox/images/icon-128x128.png',
        '/PWASoundBox/images/icon-144x144.png',
        '/PWASoundBox/images/icon-152x152.png',
        '/PWASoundBox/images/icon-192x192.png',
        '/PWASoundBox/images/icon-384x384.png',
        '/PWASoundBox/images/icon-512x512.png',
        '/PWASoundBox/images/drunk.png',
        '/PWASoundBox/images/el-pueblo.png',
        '/PWASoundBox/images/game.png',
        '/PWASoundBox/images/gitan.png',
        '/PWASoundBox/images/kassos.png',
        '/PWASoundBox/images/palmashow.png',
        '/PWASoundBox/images/rave.png',
        '/PWASoundBox/images/reaction.png',
        '/PWASoundBox/images/reaction-palmashow.png',
        '/PWASoundBox/images/rap.png',
        '/PWASoundBox/sounds/Say!.mp3',
        '/PWASoundBox/sounds/What.mp3',
        '/PWASoundBox/sounds/SayWhat.mp3',
        '/PWASoundBox/sounds/Enemenemene.mp3'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/PWASoundBox/sounds/null.mp3');
      });
    }
  }));
});
