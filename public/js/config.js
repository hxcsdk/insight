//  config options:
//    apiUrl: sets the url for api calls.  Defaults to the current domain
var config = {
  apiUrl: ''
};

(function (window) {
  window.__env = window.__env || {};
  Object.keys(config).forEach(function (key) {
    window.__env[key] = config[key];
  })
}(this));
