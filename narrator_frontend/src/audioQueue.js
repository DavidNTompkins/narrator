class AudioQueue {
  constructor() {
    this.queue = {};
    this.playing = false;
  }

  add(buffer,index) {
   // console.log('attempting to add buffer')
    if (buffer!==null) {
   //   console.log('buffer not null')
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(buffer, (audioBuffer) => {
      this.queue[index] = audioBuffer;
      console.log(this.queue)
      //this.queue.push({[index]:audioBuffer});
    //  console.log(`index: ${index} . Length: ${Object.keys(this.queue).length}`)
      if (!this.playing && (index <= Object.keys(this.queue).length)) {
        //console.log('attempting to play')
        this.playNext(index);
      }
    });
    } else {
    //  console.log('adding null buffer at '+index)
      this.queue[index] = buffer;
    }
  }

  playNext(index) {
    const buffer = this.queue[index];
    if ((buffer !== null)) {  // previously had this constraint this.queue.length > 0 &&  
      const audioContext = new AudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        this.playing = false;
        if (index < Object.keys(this.queue).length) {
          this.playNext(index+1);
        }
      };
      source.start();
      this.playing = true;
    }
  }
}

export default AudioQueue