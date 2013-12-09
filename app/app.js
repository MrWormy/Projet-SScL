$( function ( ) {

  window.App = {
    Models: {},
    Collections: {},
    Views: {}
  };

  window.template = function ( id ) {
    return _.template( $( '#template' + id ).html( ) );
  };

  var app = {}
  _.extend( app, Backbone.Events );

  App.Models.Player = Backbone.Model.extend( {
    defaults: {
      'id': 1,
      'name': 'John Doe',
      'unlockedLevel': 1,
      'currentLevel': 1,
      'score': 0
    }
  } );

  App.Models.Level = Backbone.Model.extend( {
    defaults: {
      'id': 1
    }
  } );

  App.Models.Perso = Backbone.Model.extend( {
    defaults: {
      'posX': 0,
      'posY': 0,
      'speed': 5
    }
  } );

  App.Models.Canvas = Backbone.Model.extend( {
    defaults: {
      'height': $( window ).height( ),
      'width': $( window ).width( ),
      'ratio': 1.6
    },

    initialize: function ( ) {
      this.resize( this.toJSON( ) );
    },

    resize: function ( e ) {
      var height = e.height,
        width = e.width;
      var ratio = this.get( 'ratio' );
      if ( width >= ratio * height ) {
        this.set( {
          'height': height,
          'width': ratio * height
        } );
        $( '#myCanvas' ).css( {
          'margin-top': 0 + 'px'
        } );
      } else {
        var canHeight = width / ratio
        this.set( {
          'height': canHeight,
          'width': width
        } );
        $( '#myCanvas' ).css( {
          'margin-top': ( height - canHeight ) / 2 + 'px'
        } );
      }
    }
  } );

  App.Collections.Players = Backbone.Collection.extend( {
    model: App.Models.Player,

    localStorage: new Backbone.LocalStorage( "Players" )
  } );

  App.Collections.Levels = Backbone.Collection.extend( {
    model: App.Models.Level
  } );

  App.Views.Player = Backbone.View.extend( {
    tagName: 'li',
    initialize: function ( ) {
      this.listenTo( app, 'level:up', this.levelUp );
    },

    render: function ( ) {

    },

    levelUp: function ( ) {
      var unlockedLevel = this.model.get( 'unlockedLevel' ) + 1;
      var currentLevel = this.model.get( 'currentLevel' ) + 1;
      if ( unlockedLevel == currentLevel ) {
        this.model.set( {
          'unlockedLevel': unlockedLevel,
          'currentLevel': currentLevel
        }, {
          validate: true
        } )
      } else {
        this.model.set( 'currentLevel', currentLevel, {
          validate: true
        } );
      }
    }
  } );

  App.Views.Screen = Backbone.View.extend( {
    initialize: function ( ) {
      var win = $( window );
      win.on( 'resize', {
        that: this,
        win: win
      }, this.resize );
      // var that = this 
      // window.onresize = function(){that.resize(that)};
      this.model.on( 'change', this.resizeCanvas, this );
      this.model.trigger( 'change' );
    },

    resize: function ( e ) {
      var that = e.data.that;
      var win = e.data.win;
      that.model.resize( {
        'height': win.height( ),
        'width': win.width( )
      } );
    },

    resizing: {},

    resizeCanvas: function ( ) {
      clearTimeout( this.resizing );
      var that = this;
      this.resizing = setTimeout( function ( ) {
        app.trigger( 'resize:on', that.model.toJSON( ) );
      }, 200 );
      var myCanvas = $( '#myCanvas' );
      myCanvas.css( {
        height: this.model.get( 'height' ) + 'px',
        width: this.model.get( 'width' ) + 'px'
      } );
    },
  } );

  App.Views.CanvasView = Backbone.View.extend( {
    el: '#myCanvas',

    events: {
      'mousedown': 'canvasClicked'
    },

    initialize: function ( ) {
      var myCanvas = new App.Models.Canvas( );
      var screenView = new App.Views.Screen( {
        model: myCanvas
      } );

      myPlayers = new App.Collections.Players( );
      myPlayer = new App.Models.Player( );
      myPlayers.add( myPlayer );
      myPlayers.fetch( {
        success: function ( coll, resp, opt ) {
          console.log( 'Données chargées' );
        },
        error: function ( coll, resp, opt ) {
          console.log( 'Une erreur c\' est dûr' );
        }
      } );
    },

    render: function ( ) {

    },

    canvasClicked: function ( ) {
      
    }
  } );

  var canvasView = new App.Views.CanvasView( );

} );
