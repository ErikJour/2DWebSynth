import { fifthRing, fourthRing, rootRing, thirdRing, seventhRing } from '../objects/keyboard';
import { scene, canvas, camera, renderer, mouse } from '../core/scene.js';

class Keyboard {

    constructor(raycaster, camera, rings, synth, noise, colorPalette, tunnelColor) 
    {
        this.raycaster = raycaster;
        this.camera = camera;
        this.rings = rings;
        this.synth = synth;
        this.noise = noise;
        this.colorPalette = colorPalette;
        this.tunnelColor = tunnelColor;

        this.mouse = mouse;
        this.isHoldingRootRing = false;
        this.isHoldingThirdRing = false;
        this.isHoldingFourth = false;
        this.isHoldingFifth = false;
        this.isHoldingSeventh = false;
        this.isNoteOn = false;
        this.octaveOffset = 0;
        this.activeKey = null;
        this.initListeners();
    }

    initListeners() 
    {
        window.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        window.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));

    }

    handleMouseDown(event)
    {
        // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // this.raycaster.setFromCamera(this.mouse, this.camera);
      
        // const intersects = this.raycaster.intersectObjects(this.rings);
      
        // if (intersects.length > 0) {
        //   this.isNoteOn = true;
        //   const clickedRing = intersects[0].object;
        //   if (clickedRing === rootRing) {
        //   this.isHoldingRootRing = true;
        //   this.playNote("D3", rootRing, 0.2);
        //   }
        //   else if (clickedRing === thirdRing) {
        //   this.isHoldingThirdRing = true;
        //   this.playNote("F#3", thirdRing, 0.3);
        //   }
      
        //   else if (clickedRing === fourthRing) {
        //   this.isHoldingFourth = true;
        //   this.playNote("G3", fourthRing, 0.5);
        //   }
        //   else if (clickedRing === fifthRing) {
        //   this.isHoldingFifth = true;
        //   this.playNote("A3", fifthRing, 0.6);
        //   }
        //   else if (clickedRing === seventhRing) {
        //   this.isHoldingSeventh = true;
        //   this.playNote("C4", seventhRing, 0.8);
        //   }
        // }
      }

      handleMouseUp()

      {
    //   this.isNoteOn = false;
    //   this.releaseNote();
    }

handleKeyDown(event)
{
    event.preventDefault();
    const key = event.key;
    if (this.activeKey == key) return;
    this.activeKey = key;
    this.isNoteOn = true;

    switch (key) {
        case 'j':
            this.isHoldingRootRing = true;
            this.playNote("D3", rootRing, 0.2);
            break;
        case 'k':
            this.isHoldingFourth = true;
            this.playNote("G3", fourthRing, 0.5);
            break;
         case 'l':
            this.isHoldingSeventh = true;
            this.playNote("C4", seventhRing, 0.8);
            break;
        case 'i':
            this.isHoldingThirdRing = true;
            this.playNote("F#3", thirdRing, 0.3);
            break;
        case 'o':
            this.isHoldingFifth = true;
            this.playNote("A3", fifthRing, 0.6);
            break;
        case 'ArrowLeft': // Decrease Octave
            this.octaveOffset = Math.max(this.octaveOffset - 1, -2);
            console.log(`Octave: ${this.octaveOffset}`);
            break;
        case 'ArrowRight': // Increase Octave
            this.octaveOffset = Math.min(this.octaveOffset + 1, 2);
            console.log(`Octave: ${this.octaveOffset}`);
            break;
    }
}
handleKeyUp()
{
this.isNoteOn = false;
this.activeKey = null;
this.releaseNote();
}

playNote(note, ring, frequency) {
    const baseNote = note.slice(0, -1); 
    const currentOctave = parseInt(note.slice(-1)); 

    const newOctave = currentOctave + this.octaveOffset;

    const fullNote = `${baseNote}${newOctave}`;

    const validNoteRegex = /^[A-G]#?\d$/;
    if (!validNoteRegex.test(fullNote)) {
        console.error(`Invalid note format: ${fullNote}`);
        return;
    }

    console.log(`Playing note: ${fullNote}`);



    this.synth.triggerAttack(fullNote);
    this.noise.triggerAttack();

    this.oscillationFrequency = frequency;
    ring.material.color.set(this.colorPalette.paleSkyBlue);
    ring.material.opacity = 0.9;
}



releaseNote() {
    this.synth.triggerRelease();
    this.noise.triggerRelease();

    if (this.isHoldingRootRing) { rootRing.material.color.set(this.tunnelColor); rootRing.material.opacity = 0.25; this.isHoldingRootRing = false; }
    if (this.isHoldingThirdRing) { thirdRing.material.color.set(this.tunnelColor); thirdRing.material.opacity = 0.25; this.isHoldingThirdRing = false; }
    if (this.isHoldingFourth) { fourthRing.material.color.set(this.tunnelColor); fourthRing.material.opacity = 0.25; this.isHoldingFourth = false; }
    if (this.isHoldingFifth) { fifthRing.material.color.set(this.tunnelColor); fifthRing.material.opacity = 0.25; this.isHoldingFifth = false; }
    if (this.isHoldingSeventh) { seventhRing.material.color.set(this.tunnelColor); seventhRing.material.opacity = 0.25; this.isHoldingSeventh = false; }
  }
}

export default Keyboard;



