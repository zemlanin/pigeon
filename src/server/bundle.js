const fs = require("fs");
const { promisify } = require("util");
const os = require("os");
const path = require("path");

const fsPromises = {
  access: promisify(fs.access),
  readFile: promisify(fs.readFile),
  exists: promisify(fs.exists),
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat)
};

const SRC_DIR = path.resolve(__dirname, "..", "client");
const CJS_MODULES = {
  react: require.resolve("react/umd/react.production.min.js"),
  "react-dom": require.resolve("react-dom/umd/react-dom.production.min.js"),
  emotion: require.resolve("emotion/dist/emotion.umd.min.js")
};

function wrapCJS(name, body) {
  const jsonName = JSON.stringify(name);
  const pathName = JSON.stringify("./" + name);
  return `require.cache[${pathName}]=require.cache[${jsonName}]=function(require,exports,module){${body}};`;
}

let cachedBundle = "";

async function createClientBundle() {
  const loadedModules = [];

  if (process.env.NODE_ENV === "production" && cachedBundle) {
    return cachedBundle;
  }

  for (const name in CJS_MODULES) {
    loadedModules.push(
      wrapCJS(name, (await fsPromises.readFile(CJS_MODULES[name])).toString().replace(/^\/\/# sourceMappingURL=.*$/gm, ""))
    );
  }

  for (const name of await fsPromises.readdir(SRC_DIR)) {
    const filepath = path.join(SRC_DIR, name);

    if ((await fsPromises.stat(filepath)).isDirectory()) {
      throw new Error("server/bundle.js doesn't support directories");
    }

    if (!name.endsWith(".js")) {
      continue;
    }
    loadedModules.push(
      wrapCJS(name, (await fsPromises.readFile(filepath)).toString())
    );
  }

  return (cachedBundle = `
    (function(){function require(name){
      if(!require.cache[name]){throw new Error("Module not found: "+name)}
      var m={exports:{}};require.cache[name](require,m.exports,m);return m.exports
    };require.cache={};${loadedModules.join("")};require("index.js")})()
  `);
}

if (require.main === module) {
  createClientBundle()
    .then(result => {
      process.stdout.write(result, function() {
        process.exit();
      });
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  module.exports = {
    createClientBundle
  };
}
