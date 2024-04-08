const AudioMixer = require('../index.js')
const { ToneStream, utils } = require('tone-stream')
const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const ts1 = new ToneStream(format)
const ts2 = new ToneStream(format)

ts1.concat(utils.gen_music_scale("F5 A5 B5 D5 F5 C5 D5 G4", 100, 0, 8000))
ts2.concat(utils.gen_music_scale("F6 A3 A3 B2 G7 E2 C3 F4", 100, 0, 8000))

const mixer = new AudioMixer(format, [ts1, ts2]);

const s = new Speaker(format)
mixer.pipe(s)
