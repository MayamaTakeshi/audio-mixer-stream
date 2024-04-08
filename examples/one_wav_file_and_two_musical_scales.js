const AudioMixer = require('../index.js')
const { ToneStream, utils } = require('tone-stream')
const Speaker = require('speaker')
const wav = require('wav')
const fs = require('fs')

const file = fs.createReadStream('examples/artifacts/scale-g6-89174.wav')
const reader = new wav.Reader()

reader.on('format', format => {
  console.log(format)

  const ts1 = new ToneStream(format)
  const ts2 = new ToneStream(format)

  ts1.concat(utils.gen_music_scale("C5 D5 E5 F5 G5 A5 B5 C6", 100, 0, format.sampleRate))
  ts2.concat(utils.gen_music_scale("D5 F5 G5 A5 E5 D5 F5 E4", 100, 0, format.sampleRate))

  const mixer = new AudioMixer(format, [ts1, ts2, reader]);

  const s = new Speaker(format)
  mixer.pipe(s)
})

file.pipe(reader)
