const { Readable } = require('stream')

class AudioMixer extends Readable {
  constructor(format, streams) {
    super({ objectMode: true })
    this.streams = streams
    this.format = format
    this.buffers = new Array(streams.length).fill(Buffer.alloc(0))
    this.samplesPerPixel = this.format.bitDepth / 8
    this.totalChannels = this.format.channels
  }

  _read(n) {
    const result = Buffer.alloc(this.samplesPerPixel)
    let bytesRead = 0

    for (let i = 0; i < this.streams.length; i++) {
      const buffer = this.buffers[i]
      if (buffer.length < this.samplesPerPixel) {
        const chunk = this.streams[i].read(this.samplesPerPixel)
        if (!chunk) continue // Not enough data yet
        this.buffers[i] = Buffer.concat([buffer, chunk])
      }

      if (this.buffers[i].length >= this.samplesPerPixel) {
        for (let j = 0; j < this.totalChannels; j++) {
          const value = this.buffers[i].readInt16LE(j * this.samplesPerPixel)
          const currentValue = result.readInt16LE(j * this.samplesPerPixel)
          const sum = currentValue + value
          const clampedSum = Math.max(-32768, Math.min(32767, sum)) // Clamp the sum
          result.writeInt16LE(clampedSum, j * this.samplesPerPixel)
        }
        this.buffers[i] = this.buffers[i].slice(this.samplesPerPixel)
        bytesRead += this.samplesPerPixel
      }
    }

    if (bytesRead > 0) {
      this.push(result)
    } else {
      this.push(null) // No more data
    }
  }
}

module.exports = AudioMixer
