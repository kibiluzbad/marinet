"use strict";
const
    FS = require('fs'),
    Path = require('path'),
    parent = module.parent,
    parentFile = parent.filename,
    parentDir = Path.dirname(parentFile);

let dir = Path.resolve(parentDir, './models'),
    files = FS.readdirSync(dir),
    map = {};

for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var ext = Path.extname(file);
    var base = Path.basename(file, ext);
    var path = Path.resolve(dir, file);
    map[base] = require(path);
}

module.exports = map;
