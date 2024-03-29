(function() {
  'use strict';
  var $, $async, CND, DB, FS, L, PATH, PD, PSPG, _$count, assign, badge, debug, echo, help, info, isa, jr, rpr, select, testing, type_of, types, urge, validate, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'SQLITE-BROWSER/MAIN';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  ({assign, jr} = CND);

  //...........................................................................................................
  require('./exception-handler');

  types = require('./types');

  ({isa, validate, type_of} = types);

  FS = require('fs');

  PATH = require('path');

  // glob                      = require 'glob'
  // minimatch                 = require 'minimatch'
  PD = require('pipedreams');

  ({$, $async, select} = PD);

  //...........................................................................................................
  PSPG = require('pspg');

  DB = require('./db');

  //-----------------------------------------------------------------------------------------------------------
  _$count = function(step) {
    var nr;
    nr = 0;
    return PD.$watch((d) => {
      nr += +1;
      if ((modulo(nr, step)) === 0) {
        whisper('µ44744', nr);
      }
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.browse = function(db_path, key, value) {
    return new Promise((resolve, reject) => {
      var S, pipeline, source, sql;
      // validate.sqlb_settings settings
      debug('^7356347^', {db_path, key, value});
      if (key !== 'c') {
        throw new Error("µ33221 Error");
      }
      validate.nonempty_text(value);
      S = {};
      S.db = DB.new_db(db_path);
      sql = value;
      source = PD.new_generator_source(S.db.$.query(sql));
      //.........................................................................................................
      pipeline = [];
      pipeline.push(source);
      pipeline.push(_$count(100));
      /* TAINT resolve may be called twice */
      // pipeline.push PD.$sort()                          if testing
      pipeline.push(PSPG.$tee_as_table(function() {
        return resolve();
      }));
      /* TAINT resolve may be called before tee has finished writing (?) */
      pipeline.push(PD.$drain());
      PD.pull(...pipeline);
      //.........................................................................................................
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.cli = async function(db_path, key, value) {
    //.......................................................................................................
    validate.sqlb_db_path(db_path);
    validate.sqlb_key(key);
    // debug 'µ33444', arguments
    // debug 'µ33444', "running #{__filename} #{jr [ db_path, key, value, ]}"
    return (await this.browse(db_path, key, value));
  };

  // settings = L.new_settings './README.md'
  // db_path = PATH.resolve '/home/flow/jzr/mkts-mirage/db/mkts.db'
  // await L.browse db_path, 'c', "select * from main;"
  // help 'ok'

  //###########################################################################################################
  if (module.parent == null) {
    testing = true;
    L = this;
    (async function() {
      await L.cli(...process.argv.slice(2));
      return help('ok');
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map