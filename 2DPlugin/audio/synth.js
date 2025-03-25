import * as Tone from "tone";

const synth = new Tone.MonoSynth({
    oscillator: {
        type: "sine"
    },
    envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.9,
        release: 0.01
    }
});

synth.envelope.set({
    attack: 0.05,
    decay: 0.1,
    sustain: 0.2,
    release: 0.2
});

const noise = new Tone.NoiseSynth();

synth.volume.value = Tone.gainToDb(0.0);

synth.oscillator.type = "sine";
noise.envelope.set({
    attack: 0.05,
    decay: 0.1,
    sustain: 0.2,
    release: 0.2
});


synth.filter.frequency.value = 0;

const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 20000,
    rolloff: -24,
    Q: 1
}).toDestination();

synth.filterEnvelope.attack = 0.0;
synth.filterEnvelope.decay = 0.0;
synth.filterEnvelope.sustain = 0.0;
synth.filterEnvelope.release = 0.0;

synth.connect(filter);
noise.connect(filter);

const lfo = new Tone.LFO({
    frequency: 20,
    min: -50,  
    max: 50,  
});

lfo.amplitude.value = 1;
lfo.connect(synth.detune);

filter.attack = 0.0;
filter.decay = 0.0;
filter.sustain = 0.0;
filter.release = 0.0;

noise.volume.value = Tone.gainToDb(0.0);


window.addEventListener('click', async () => {
    await Tone.start();
    lfo.start();

    console.log('Audio Context Started');
});

Tone.getTransport().start();

export { synth, noise, filter, lfo };