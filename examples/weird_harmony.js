const AudioMixer = require('../index.js')
const { ToneStream, utils } = require('tone-stream')
const Speaker = require('speaker')

const sampleRate = 8000

const format = {
	sampleRate,
	bitDepth: 16,
	channels: 1
}

const ts1 = new ToneStream(format)
const ts2 = new ToneStream(format)
const ts3 = new ToneStream(format)

ts1.concat(utils.gen_music_scale("G3 E3 B3 D4", 200, 0, sampleRate))
ts2.concat(utils.gen_music_scale("F3 A3 D4 F4", 200, 0, sampleRate))
ts3.concat(utils.gen_music_scale("A#4 A3 D#4 G#4", 200, 0, sampleRate))

const mixer = new AudioMixer(format, [ts1, ts2, ts3]);

const s = new Speaker(format)
mixer.pipe(s)


