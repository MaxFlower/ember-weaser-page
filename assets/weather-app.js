"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('weather-app/adapters/application', ['exports', 'ember-data', 'weather-app/config/environment'], function (exports, _emberData, _weatherAppConfigEnvironment) {
  exports['default'] = _emberData['default'].JSONAPIAdapter.extend({
    host: _weatherAppConfigEnvironment['default'].APP.APIHOST
  });
});
define('weather-app/adapters/weather', ['exports', 'weather-app/adapters/application', 'weather-app/config/environment'], function (exports, _weatherAppAdaptersApplication, _weatherAppConfigEnvironment) {
  exports['default'] = _weatherAppAdaptersApplication['default'].extend({
    buildURL: function buildURL() {
      return _weatherAppConfigEnvironment['default'].APP.APIHOST + '/weather';
    }
  });
});
define('weather-app/app', ['exports', 'ember', 'weather-app/resolver', 'ember-load-initializers', 'weather-app/config/environment'], function (exports, _ember, _weatherAppResolver, _emberLoadInitializers, _weatherAppConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _weatherAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _weatherAppConfigEnvironment['default'].podModulePrefix,
    Resolver: _weatherAppResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _weatherAppConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('weather-app/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'weather-app/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _weatherAppConfigEnvironment) {

  var name = _weatherAppConfigEnvironment['default'].APP.name;
  var version = _weatherAppConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('weather-app/components/city-weather', ['exports', 'ember'], function (exports, _ember) {
		exports['default'] = _ember['default'].Component.extend({
				actions: {
						removeCity: function removeCity(city) {
								this.sendAction('remove', city);
						}
				}
		});
});
define('weather-app/components/main-header', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('weather-app/controllers/weather', ['exports', 'ember', 'weather-app/config/environment'], function (exports, _ember, _weatherAppConfigEnvironment) {
  exports['default'] = _ember['default'].Controller.extend({
    key: _weatherAppConfigEnvironment['default'].APP.APIKEY,
    city: '',
    cityArray: [],
    currentLocal: 'en',
    localArray: _ember['default'].computed('currentLocal', function () {
      var self = this;
      var arr = ['en', 'de', 'es', 'ru', 'fr', 'zh'];
      var result = [];

      var Local = _ember['default'].Object.extend({
        lang: '',
        isActive: false
      });

      arr.forEach(function (item) {
        var object = Local.create({
          lang: item,
          isActive: false
        });

        if (object.lang === self.get('currentLocal')) {
          object.isActive = true;
        } else {
          object.isActive = false;
        }

        result.push(object);
      });

      return result;
    }),
    actions: {
      add: function add(name) {
        var _this = this;

        this.store.queryRecord('weather', { q: name, lang: this.get('currentLocal'), units: 'metric', APPID: this.get('key') }).then(function (city) {
          _this.get('cityArray').pushObject(city);
          _this.set('city', '');
        });
      },
      remove: function remove(city) {
        this.get('cityArray').removeObject(city);
      },
      setLocal: function setLocal(local) {
        this.set('currentLocal', local);
      }
    }
  });
});
define('weather-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('weather-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('weather-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'weather-app/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _weatherAppConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_weatherAppConfigEnvironment['default'].APP.name, _weatherAppConfigEnvironment['default'].APP.version)
  };
});
define('weather-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('weather-app/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('weather-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('weather-app/initializers/export-application-global', ['exports', 'ember', 'weather-app/config/environment'], function (exports, _ember, _weatherAppConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_weatherAppConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _weatherAppConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_weatherAppConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('weather-app/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('weather-app/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('weather-app/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("weather-app/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('weather-app/models/weather', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    coordinatelon: _emberData['default'].attr('number'),
    coordinatelat: _emberData['default'].attr('number'),
    country: _emberData['default'].attr('string'),
    sunrise: _emberData['default'].attr('number'),
    sunset: _emberData['default'].attr('number'),
    description: _emberData['default'].attr('string'),
    temp: _emberData['default'].attr('number'),
    humidity: _emberData['default'].attr('number'),
    pressure: _emberData['default'].attr('number'),
    temp_min: _emberData['default'].attr('number'),
    temp_max: _emberData['default'].attr('number'),
    windspeed: _emberData['default'].attr('number'),
    winddeg: _emberData['default'].attr('number'),
    clouds: _emberData['default'].attr('number'),
    rain: _emberData['default'].attr('string'),
    snow: _emberData['default'].attr('string'),
    date: _emberData['default'].attr('number'),
    cityname: _emberData['default'].attr('string'),
    cityid: _emberData['default'].attr('number')
  });
});
define('weather-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('weather-app/router', ['exports', 'ember', 'weather-app/config/environment'], function (exports, _ember, _weatherAppConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _weatherAppConfigEnvironment['default'].locationType,
    rootURL: _weatherAppConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('contact');
    this.route('weather');
  });

  exports['default'] = Router;
});
define('weather-app/routes/contact', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('weather-app/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('weather-app/routes/weather', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('weather-app/serializers/weather', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].JSONSerializer.extend({
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload) {
      payload.coordinatelon = payload.coord.lon;
      payload.coordinatelat = payload.coord.lat;
      payload.country = payload.sys.country;
      payload.sunrise = payload.sys.sunrise;
      payload.sunset = payload.sys.sunset;
      payload.description = payload.weather[0].description;
      payload.temp = payload.main.temp;
      payload.humidity = payload.main.humidity;
      payload.pressure = payload.main.pressure;
      payload.temp_min = payload.main.temp_min;
      payload.temp_max = payload.main.temp_max;
      payload.windspeed = payload.wind.speed;
      payload.winddeg = payload.wind.deg;
      payload.clouds = payload.clouds.all;
      payload.rain = JSON.stringify(payload.rain);
      payload.snow = JSON.stringify(payload.snow);
      payload.date = payload.dt;
      payload.cityname = payload.name;
      payload.cityid = payload.id;

      delete payload.coord;
      delete payload.sys;
      delete payload.weather;
      delete payload.base;
      delete payload.main;
      delete payload.wind;
      delete payload.dt;
      delete payload.name;

      return this._super.apply(this, arguments);
    }
  });
});
define('weather-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("weather-app/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 0
          }
        },
        "moduleName": "weather-app/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container main-wrapper");
        var el2 = dom.createTextNode("  \n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("hr");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("footer");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "col-lg-12");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Copyright © Weather application. Powered by ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "http://emberjs.com/");
        var el7 = dom.createTextNode("Ember JS");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(". Max Tsvetkov 2016");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 1]), 1, 1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "main-header", ["loc", [null, [1, 0], [1, 15]]], 0, 0, 0, 0], ["content", "outlet", ["loc", [null, [4, 4], [4, 14]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("weather-app/templates/components/city-weather", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.2",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "weather-app/templates/components/city-weather.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "col-md-3 col-md-offset-1 well");
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h5");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("temperature: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("° (min: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("°, max: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("°)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("humidity: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("%");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("wind speed: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" m/s");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("pressure: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "class", "btn btn-danger");
          var el3 = dom.createTextNode("Remove");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("						\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3]);
          var element2 = dom.childAt(element0, [13]);
          var morphs = new Array(9);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(element1, 1, 1);
          morphs[2] = dom.createMorphAt(element1, 3, 3);
          morphs[3] = dom.createMorphAt(element1, 5, 5);
          morphs[4] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          morphs[5] = dom.createMorphAt(dom.childAt(element0, [7]), 1, 1);
          morphs[6] = dom.createMorphAt(dom.childAt(element0, [9]), 1, 1);
          morphs[7] = dom.createMorphAt(dom.childAt(element0, [11]), 1, 1);
          morphs[8] = dom.createElementMorph(element2);
          return morphs;
        },
        statements: [["content", "city.cityname", ["loc", [null, [3, 6], [3, 23]]], 0, 0, 0, 0], ["content", "city.temp", ["loc", [null, [4, 18], [4, 31]]], 0, 0, 0, 0], ["content", "city.temp_min", ["loc", [null, [4, 43], [4, 60]]], 0, 0, 0, 0], ["content", "city.temp_max", ["loc", [null, [4, 72], [4, 89]]], 0, 0, 0, 0], ["content", "city.description", ["loc", [null, [5, 5], [5, 25]]], 0, 0, 0, 0], ["content", "city.humidity", ["loc", [null, [6, 15], [6, 32]]], 0, 0, 0, 0], ["content", "city.windspeed", ["loc", [null, [7, 17], [7, 35]]], 0, 0, 0, 0], ["content", "city.pressure", ["loc", [null, [8, 15], [8, 32]]], 0, 0, 0, 0], ["element", "action", ["removeCity", ["get", "city", ["loc", [null, [9, 55], [9, 59]]], 0, 0, 0, 0]], [], ["loc", [null, [9, 33], [9, 61]]], 0, 0]],
        locals: ["city"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "weather-app/templates/components/city-weather.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 1, 1, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "each", [["get", "cities", ["loc", [null, [1, 8], [1, 14]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [11, 9]]]], ["content", "yield", ["loc", [null, [12, 0], [12, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("weather-app/templates/components/main-header", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.2",
          "loc": {
            "source": null,
            "start": {
              "line": 15,
              "column": 5
            },
            "end": {
              "line": 17,
              "column": 6
            }
          },
          "moduleName": "weather-app/templates/components/main-header.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("				    About\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.2",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 5
            },
            "end": {
              "line": 22,
              "column": 6
            }
          },
          "moduleName": "weather-app/templates/components/main-header.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("				    Look a Weather\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.2",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 5
            },
            "end": {
              "line": 27,
              "column": 6
            }
          },
          "moduleName": "weather-app/templates/components/main-header.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("				    Contact\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 34,
            "column": 0
          }
        },
        "moduleName": "weather-app/templates/components/main-header.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "navbar navbar-inverse navbar-fixed-top");
        dom.setAttribute(el1, "role", "navigation");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n	  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "navbar-header");
        var el4 = dom.createTextNode("\n	    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "type", "button");
        dom.setAttribute(el4, "class", "navbar-toggle");
        dom.setAttribute(el4, "data-toggle", "collapse");
        dom.setAttribute(el4, "data-target", ".navbar-collapse");
        var el5 = dom.createTextNode("\n	      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "sr-only");
        var el6 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "class", "navbar-brand");
        dom.setAttribute(el4, "href", "/");
        var el5 = dom.createTextNode("EmberJS application.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	  ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "collapse navbar-collapse");
        var el4 = dom.createTextNode("\n	    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4, "class", "nav navbar-nav");
        var el5 = dom.createTextNode("\n	      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("	      ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("	      ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("	      ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	  ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("/.nav-collapse ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 3, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 1, 1);
        morphs[3] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["block", "link-to", ["index"], [], 0, null, ["loc", [null, [15, 5], [17, 18]]]], ["block", "link-to", ["weather"], [], 1, null, ["loc", [null, [20, 5], [22, 18]]]], ["block", "link-to", ["contact"], [], 2, null, ["loc", [null, [25, 5], [27, 18]]]], ["content", "yield", ["loc", [null, [33, 0], [33, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("weather-app/templates/contact", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 36,
            "column": 0
          }
        },
        "moduleName": "weather-app/templates/contact.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        dom.setAttribute(el1, "id", "contact-page");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row-fluid");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-8");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("iframe");
        dom.setAttribute(el4, "src", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2301.6485760489527!2d20.449602615892598!3d54.76856528030167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e33ef757994b07%3A0xc6de7a2fc8077f20!2z0YPQuy4g0JvRg9C60LDRiNC-0LLQsCwg0JrQsNC70LjQvdC40L3Qs9GA0LDQtCwg0JrQsNC70LjQvdC40L3Qs9GA0LDQtNGB0LrQsNGPINC-0LHQuy4!5e0!3m2!1sru!2sru!4v1473283273858");
        dom.setAttribute(el4, "width", "600");
        dom.setAttribute(el4, "height", "450");
        dom.setAttribute(el4, "frameborder", "0");
        dom.setAttribute(el4, "style", "border:0");
        dom.setAttribute(el4, "allowfullscreen", "");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    	\n      	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-4");
        var el4 = dom.createTextNode("\n      		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "media");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5, "class", "media-object img-responsive");
        dom.setAttribute(el5, "src", "assets/img/profile-photo.jpg");
        dom.setAttribute(el5, "width", "100px");
        dom.setAttribute(el5, "alt", "...");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "media-body");
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        dom.setAttribute(el6, "class", "media-heading");
        var el7 = dom.createTextNode("Max Tsvetkov ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("small");
        var el8 = dom.createTextNode("Web-developer");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("Hello there. I'm glad to present my Ember-app. Please contact with me if You have something to say or advices how to make app better.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        var el7 = dom.createTextNode("My skills:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "skills");
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "label label-default");
        var el8 = dom.createTextNode("HTML/Jade");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "label label-primary");
        var el8 = dom.createTextNode("CSS/SCSS/SASS");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "label label-success");
        var el8 = dom.createTextNode("SCRUM-Agile");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "label label-info");
        var el8 = dom.createTextNode("Git/Mercurial");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "label label-warning");
        var el8 = dom.createTextNode("JavaScript/EmberJs/AngularLS");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "label label-danger");
        var el8 = dom.createTextNode("PHP/Yii2/Laravel");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "label label-primary");
        var el8 = dom.createTextNode("MySQL, MongoDB, Oracle");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n					");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n				");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("									\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    		\n    		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("address");
        var el5 = dom.createTextNode("\n    			");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("strong");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "class", "glyphicon glyphicon-globe");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Kaliningrad, Russian Federation");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    			");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "glyphicon glyphicon-home");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" 236000, 37-7 Lukashova Str.");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("    			\n    			");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "glyphicon glyphicon-envelope");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" maxtsvetapple@gmail.com");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    			");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "glyphicon glyphicon-earphone");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("abbr");
        dom.setAttribute(el5, "title", "Phone");
        var el6 = dom.createTextNode("+7 962 263 3876");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("   			\n    		");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [35, 0], [35, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("weather-app/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.2",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 20
            },
            "end": {
              "line": 18,
              "column": 20
            }
          },
          "moduleName": "weather-app/templates/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    	Try free!\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.2",
          "loc": {
            "source": null,
            "start": {
              "line": 56,
              "column": 22
            },
            "end": {
              "line": 58,
              "column": 22
            }
          },
          "moduleName": "weather-app/templates/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("		                    	Contact with me\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.2",
          "loc": {
            "source": null,
            "start": {
              "line": 107,
              "column": 14
            },
            "end": {
              "line": 109,
              "column": 14
            }
          },
          "moduleName": "weather-app/templates/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("		               	Let's start\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 124,
            "column": 0
          }
        },
        "moduleName": "weather-app/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        dom.setAttribute(el1, "id", "index-page");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-2");
        dom.setAttribute(el3, "style", "position: fixed;");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        dom.setAttribute(el4, "class", "lead");
        var el5 = dom.createTextNode("Page jumper:");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "list-group");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5, "href", "#one");
        dom.setAttribute(el5, "class", "list-group-item");
        var el6 = dom.createTextNode("OpenWeatherMap");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5, "href", "#two");
        dom.setAttribute(el5, "class", "list-group-item");
        var el6 = dom.createTextNode("Powered by Ember");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5, "href", "#three");
        dom.setAttribute(el5, "class", "list-group-item");
        var el6 = dom.createTextNode("How to use");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-9 col-md-offset-3");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "thumbnail");
        dom.setAttribute(el4, "id", "one");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5, "class", "img-responsive");
        dom.setAttribute(el5, "src", "assets/img/open-weather-map.jpg");
        dom.setAttribute(el5, "alt", "");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "caption-full");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        var el7 = dom.createElement("a");
        dom.setAttribute(el7, "href", "http://openweathermap.org/");
        var el8 = dom.createTextNode("OpenWheatherMap");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("Get current weather in any city. It easy with my application based on external data with ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7, "target", "_blank");
        dom.setAttribute(el7, "href", "http://openweathermap.org/api");
        var el8 = dom.createTextNode("API - http://openweathermap.org/api");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(".");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("Want to compare weather for several cities? No problem! If You interested to look instance code visit \n                    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("strong");
        var el8 = dom.createElement("a");
        dom.setAttribute(el8, "href", "https://github.com/MaxFlower/Ember-weather");
        var el9 = dom.createTextNode("this repo");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(".\n                    ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" with Ember project.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("The entire goal of writing software should be to create something that can last. I plan out applications so that they are properly documented, tested, scalable, and monitored. This leads to software systems that are resistant to the effects of overwhelming code debt, spaghetti code, and consistently having to be burned down and built back up.");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("hr");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h4");
        var el7 = dom.createTextNode("Limitation for weather-service:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        var el7 = dom.createTextNode("\n                    	");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("Calls 10min: 600");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    	");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("Calls 1day: 50,000");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    	");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("Threshold: 7,200");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    	");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("Hourly forecast: 5");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    	");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("Daily forecast: 0");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("hr");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("                \n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "ratings");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        dom.setAttribute(el6, "class", "pull-right");
        var el7 = dom.createTextNode("7 sep 2016");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("p");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("            \n                        0 stars for repo.\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "well");
        dom.setAttribute(el4, "id", "two");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "media");
        var el6 = dom.createTextNode("\n				    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "class", "pull-left");
        dom.setAttribute(el6, "href", "http://emberjs.com/");
        dom.setAttribute(el6, "target", "_blank");
        dom.setAttribute(el6, "style", "width: 200px;");
        var el7 = dom.createTextNode("\n				        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7, "class", "media-object img-responsive");
        dom.setAttribute(el7, "src", "assets/img/ember-getting-started-image.png");
        dom.setAttribute(el7, "alt", "...");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n				    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "media-body");
        var el7 = dom.createTextNode("\n					    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        dom.setAttribute(el7, "class", "media-heading");
        var el8 = dom.createTextNode("Ember application.");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n					    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("hr");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n					    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h5");
        var el8 = dom.createTextNode("Ember : 2.7.2");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h5");
        var el8 = dom.createTextNode("Ember Data : 2.7.0");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n						");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h5");
        var el8 = dom.createTextNode("jQuery : 2.2.4");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("	\n					    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "text-right");
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("		                ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("		                                \n					");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n					");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("hr");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("		\n				");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "row");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "col-md-12");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star-empty");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            My Ember experience.\n                            \n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        var el8 = dom.createTextNode("Complited projects for TV system, for example Video on Demand application for large company.");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "row");
        var el6 = dom.createTextNode("\n                        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "col-md-12");
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            JavaScript                          \n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        var el8 = dom.createTextNode("I've already prepared to ask for your question!");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "row");
        var el6 = dom.createTextNode("\n                        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "col-md-12");
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-star-empty");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                            Backend\n                            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        var el8 = dom.createTextNode("I definitely recommend to ask me what I can to do for You.");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "well");
        dom.setAttribute(el4, "id", "three");
        var el5 = dom.createTextNode("\n            	");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "text-right");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("hr");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("Step 1: Choose local format and type city name (for example, 'Paris' without btanches):");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5, "class", "media-object img-responsive");
        dom.setAttribute(el5, "src", "assets/img/choose-local-and-city.png");
        dom.setAttribute(el5, "alt", "...");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("Step 2: Have a look to results:");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5, "class", "media-object img-responsive");
        dom.setAttribute(el5, "src", "assets/img/have-look-result.png");
        dom.setAttribute(el5, "alt", "...");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "text-center");
        var el6 = dom.createTextNode("\n                	");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "#index-page");
        dom.setAttribute(el6, "class", "btn-link");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-arrow-up");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" Up");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 3]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 3]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 1, 3, 11]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 1]), 1, 1);
        morphs[3] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["block", "link-to", ["weather"], ["class", "pull-right btn btn-primary"], 0, null, ["loc", [null, [16, 20], [18, 32]]]], ["block", "link-to", ["contact"], ["class", "pull-right btn btn-success"], 1, null, ["loc", [null, [56, 22], [58, 34]]]], ["block", "link-to", ["weather"], ["class", "btn btn-success"], 2, null, ["loc", [null, [107, 14], [109, 26]]]], ["content", "outlet", ["loc", [null, [123, 0], [123, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("weather-app/templates/weather", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.2",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 4
            },
            "end": {
              "line": 10,
              "column": 7
            }
          },
          "moduleName": "weather-app/templates/weather.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("				    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1, "type", "button");
          var el2 = dom.createTextNode("\n				    	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2, "alt", "...");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createElementMorph(element0);
          morphs[2] = dom.createAttrMorph(element1, 'src');
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["btn ", ["subexpr", "if", [["get", "local.isActive", ["loc", [null, [7, 46], [7, 60]]], 0, 0, 0, 0], "btn-primary", "btn-default"], [], ["loc", [null, [7, 41], [7, 90]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["element", "action", ["setLocal", ["get", "local.lang", ["loc", [null, [7, 112], [7, 122]]], 0, 0, 0, 0]], [], ["loc", [null, [7, 92], [7, 124]]], 0, 0], ["attribute", "src", ["concat", ["assets/img/", ["get", "local.lang", ["loc", [null, [8, 32], [8, 42]]], 0, 0, 0, 0], "_16.png"], 0, 0, 0, 0, 0], 0, 0, 0, 0]],
        locals: ["local"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "weather-app/templates/weather.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("	\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("	    \n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-3 well");
        dom.setAttribute(el3, "style", "min-height: 400px; margin-right: 10px;");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Select local format for output:");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "btn-group");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("form");
        var el5 = dom.createTextNode("\n			  ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "form-group");
        var el6 = dom.createTextNode("\n			    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("label");
        dom.setAttribute(el6, "for", "city");
        var el7 = dom.createTextNode("City:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n			    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("			    \n			  ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("			  \n			  ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "submit");
        dom.setAttribute(el5, "class", "btn btn-primary");
        var el6 = dom.createTextNode("Add");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-8 well");
        dom.setAttribute(el3, "style", "min-height: 400px;");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "container-fluid");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("		\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("		  \n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0, 1]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element3, [5]);
        var element5 = dom.childAt(element4, [3]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element3, [3]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element4, [1]), 3, 3);
        morphs[2] = dom.createElementMorph(element5);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [3, 1]), 1, 1);
        morphs[4] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["block", "each", [["get", "localArray", ["loc", [null, [6, 12], [6, 22]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [6, 4], [10, 16]]]], ["inline", "input", [], ["type", "text", "class", "form-control", "id", "city", "value", ["subexpr", "@mut", [["get", "city", ["loc", [null, [15, 64], [15, 68]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [15, 7], [15, 70]]], 0, 0], ["element", "action", ["add", ["get", "city", ["loc", [null, [17, 66], [17, 70]]], 0, 0, 0, 0]], [], ["loc", [null, [17, 51], [17, 72]]], 0, 0], ["inline", "city-weather", [], ["cities", ["subexpr", "@mut", [["get", "cityArray", ["loc", [null, [22, 26], [22, 35]]], 0, 0, 0, 0]], [], [], 0, 0], "remove", "remove"], ["loc", [null, [22, 4], [22, 53]]], 0, 0], ["content", "outlet", ["loc", [null, [27, 0], [27, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0]
    };
  })());
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('weather-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'weather-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("weather-app/app")["default"].create({"APIHOST":"http://api.openweathermap.org/data/2.5","APIKEY":"cb7f79462edd410008232502ce5fa718","name":"weather-app","version":"0.0.0+8afd948d"});
}

/* jshint ignore:end */
//# sourceMappingURL=weather-app.map