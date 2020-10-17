
var box = document.querySelector('.box');
var button = document.querySelector('button');

var bannerToInstallApp;

function installServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' }).then((sw) => {
      fetchExample();
    });
  }
}

button.addEventListener('click', () => {
  openBannerToInstallApp();
  /*
  if (box.classList.contains('visible')) {
    box.classList.remove('visible');
  } else {
    box.classList.add('visible');
  }
  */
});

installServiceWorker();

function fetchExample() {
  fetch('https://httpbin.org/ip')
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log(data.origin);
    //box.style.height = (data.origin.substr(0, 2) * 5) + 'px';
  });
}




function openBannerToInstallApp() {
  if (bannerToInstallApp) {
    bannerToInstallApp.prompt();

    bannerToInstallApp.userChoice().then(coiseResult => {
      if (coiseResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    bannerToInstallApp = null;
  }
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  bannerToInstallApp = event;
});