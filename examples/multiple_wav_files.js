const AudioMixer = require('../index.js')
const { ToneStream, utils } = require('tone-stream')
const Speaker = require('speaker')
const wav = require('wav')
const fs = require('fs')
const _ = require('lodash')
const path = require('path')

function usage() {
  const app = path.basename(__filename)
  console.log(`
You must pass a list of wav files.
Ex:   examples/artifacts/scale-g6-89174.wav examples/artifacts/dramatic-guitar-82852.wav
      examples/artifacts/*.wav
`)
}

if(process.argv.length < 3) {
  usage()
  process.exit(1)
}

const files = process.argv.slice(2)
console.log("files", files)

const readers = _.map(files, file => {
   const f = fs.createReadStream(file)
   const reader = new wav.Reader()
   f.pipe(reader)
   return reader
})
//console.log("readers:", readers)

const promises = _.map(readers, reader => {
  return new Promise((resolve, reject) => {
    reader.on('format', format => {
      resolve(format)
    })
  })
})
//console.log("promises:", promises)

async function main() {
  const formats = await Promise.all(promises)
  //console.log("formats:", formats)
  const allEqual = formats.reduce((acc, obj) => {
      return acc && _.isEqual(obj, formats[0])
  }, true)
  if(!allEqual) {
    console.log("Format mismatch. All files should have the same format")
    process.exit(1)
  }
  const format = formats[0]
  console.log("format", format)

  const mixer = new AudioMixer(format, readers)

  const s = new Speaker(format)
  mixer.pipe(s)
}

main()
