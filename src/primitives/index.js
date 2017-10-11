// Import all js files in this directory (excluding this one)
const r = require.context('.', true, /^.*(?!index)\.js/)
r.keys().forEach(r)
