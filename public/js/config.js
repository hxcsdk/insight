//  config options:
//    apiUrl: sets the url for api calls.  Defaults to the current domain
//    onTestnet: sets whether or not this explorer is connected to the testnet
var config = {
  apiUrl: '',
  onTestnet: true
};

(function (window) {
  window.__env = window.__env || {};
  Object.keys(config).forEach(function (key) {
    window.__env[key] = config[key];
  })
}(this));
