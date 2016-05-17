#!/usr/bin/env node
var glob = require("glob"),
    gtp = require("gettext-parser"),
    fs = require("fs"),
    path = require("path");

var localesPath = "locales/*.po";
var translations = {};

glob(localesPath, function(err, files) {
  files.map(function(file) {
    var fileContent = fs.readFileSync(file);
    var po = gtp.po.parse(fileContent);
    var trans = po.translations[""];

    var lang = path.parse(file).name;
    translations[lang] = {};

    for(k in trans) {
      var transData = trans[k];
      if(transData.msgid && transData.msgstr.length) {
        translations[lang][transData.msgid] = transData.msgstr[0]
      }
    }
  });

  /***************************************************************************/
  /* Creating translations.js
  /***************************************************************************/
  var wstream = fs.createWriteStream("src/translations.js");
  wstream.write(`export const translations = {\n`);
  for(lang in translations) {
    wstream.write(`  ${lang}: {\n`);
      for(trans in translations[lang]) {
        wstream.write(`    "${trans}": "${translations[lang][trans]}",\n`)
      }
    wstream.write(`  }\n`);
  }
  wstream.write(`}\n`);
});
