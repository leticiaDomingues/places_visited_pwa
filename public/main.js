var bannerToInstallApp;

function installServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((sw) => {
      fetchExample();
    });
  }
}

installServiceWorker();

function fetchExample() {
  fetch('https://httpbin.org/ip')
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log(data.origin);
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