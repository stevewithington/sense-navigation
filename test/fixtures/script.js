// Input your config
const config = {
  host: 'localhost',
  prefix: '/',
  port: '5000',
  isSecure: false,
  rejectUnauthorized: false,
  apiKey: 'X1F9wXDNLh691o0RnnYf5UrEl90AepwJ', // Change to env variable
  appname: 'sense-navigation.qvf'
};

function authenticate() {
  Playground.authenticate(config);
}

require.config({
  paths: {
    js: (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') + config.prefix + 'resources/js',
    themes: (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') + config.prefix + 'resources/themes',
    autogenerated: (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') + config.prefix + 'resources/autogenerated',
    local: 'http://localhost:8000/src'
  }
});

function main() {
  require( ["js/qlik"], function ( qlik  ) {
    // Suppress Qlik error dialogs and handle errors how you like.
    qlik.setOnError( function ( error ) {
      console.log( error );
    });

    // Open a dataset on the server.
    let app = qlik.openApp( config.appname, config );
    window.app = app;

    app.model.waitForOpen.promise.then( function() {
      // Logging app info
      app.model.enigmaModel.getAppProperties().then( function( prop ) {
        console.log( "Connecting to app: %s (%s)", prop.qTitle, config.appname  );
        document.body.classList.add("appAvailable")
      } );
    });
  } );
}


function addExtension( arguments ) {

  dataDef = arguments[0] && JSON.parse( arguments[0] ) || [];
  options = arguments[1] && JSON.parse( arguments[1] ) || {};

  console.log( "Extension is using:\nDatadef - ", dataDef, "\nOptions - ", options  );

  require( ["js/qlik"], function ( qlik  ) {

    require(['../build/dev/swr-sense-navigation'], function( senseNavigation ) {

      // Register the extension

      qlik.registerExtension( "sense-navigation", senseNavigation );

      app.model.waitForOpen.promise.then( function() {

        // Creating the visualization
        app.visualization.create(
          "sense-navigation",
          dataDef,
          options
        ).then( function ( vis ) {
          vis.show( "extension", {
            onRendered: function(){
              document.getElementById("extension").classList.add( "rendered" );
            }
          } );
        } ).catch( function ( err ) {
          console.error( err );
        } );
      });
    } );
  } );
}