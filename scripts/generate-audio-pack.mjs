import { mkdir, writeFile } from 'node:fs/promises';

const RATE = 22050;
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const LANGS = {
  es: ['m','p','s','l','t','n','d','c','b','f','r','g','v','j','ñ','z'],
  ca: ['m','p','s','l','t','n','d','c','b','f','r','g','v','j','ny','x','z','ll']
};
const formants = { a:[800,1200], e:[500,1900], i:[300,2400], o:[500,900], u:[300,700] };
const safe = value => value === 'ñ' ? 'n-tilde' : value;
const seedFor = text => [...text].reduce((n,c)=>(n*33+c.codePointAt(0))>>>0,2166136261);

function envelope(i, n, attack=.06, release=.14) {
  const x=i/n;
  return Math.min(1,x/attack,(1-x)/release);
}
function vowel(v, seconds=.42) {
  const n=Math.floor(RATE*seconds), out=new Float32Array(n), [f1,f2]=formants[v]||formants.a;
  for(let i=0;i<n;i++){
    const t=i/RATE, f0=185-18*t/seconds;
    out[i]=envelope(i,n)*(.42*Math.sin(2*Math.PI*f0*t)+.2*Math.sin(2*Math.PI*f1*t)+.12*Math.sin(2*Math.PI*f2*t));
  }
  return out;
}
function consonant(c, seconds=.24) {
  const n=Math.floor(RATE*seconds), out=new Float32Array(n);let seed=seedFor(c);
  for(let i=0;i<n;i++){
    const t=i/RATE, env=envelope(i,n,.04,.2);seed=(1664525*seed+1013904223)>>>0;const rnd=(seed/4294967295)*2-1;
    if(['s','f','j','x','z'].includes(c)) out[i]=rnd*env*.34*(c==='s'||c==='z'?1:.7);
    else if(['p','t','c','k','b','d','g'].includes(c)) out[i]=(i<n*.16?rnd*.65:Math.sin(2*Math.PI*155*t)*.18)*env;
    else if(['m','n','ñ','ny'].includes(c)) out[i]=(Math.sin(2*Math.PI*145*t)+.3*Math.sin(2*Math.PI*290*t))*env*.32;
    else if(c==='r') out[i]=Math.sin(2*Math.PI*180*t)*(Math.sin(2*Math.PI*25*t)>.15?1:.12)*env*.45;
    else out[i]=(Math.sin(2*Math.PI*180*t)+.22*Math.sin(2*Math.PI*540*t))*env*.32;
  }
  return out;
}
function join(...parts) {
  const gap=Math.floor(RATE*.025), size=parts.reduce((n,p)=>n+p.length,0)+gap*(parts.length-1), out=new Float32Array(size);let at=0;
  parts.forEach((p,i)=>{out.set(p,at);at+=p.length+(i<parts.length-1?gap:0)});return out;
}
function wav(samples) {
  const b=Buffer.alloc(44+samples.length*2);b.write('RIFF',0);b.writeUInt32LE(36+samples.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(RATE,24);b.writeUInt32LE(RATE*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);
  for(let i=0;i<samples.length;i++)b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*30000),44+i*2);return b;
}

for(const [lang, consonants] of Object.entries(LANGS)){
  const soundDir=`assets/audio/${lang}/sounds`, sylDir=`assets/audio/${lang}/syllables`;await mkdir(soundDir,{recursive:true});await mkdir(sylDir,{recursive:true});
  for(const v of VOWELS){const audio=vowel(v);await writeFile(`${soundDir}/${v}.wav`,wav(audio));await writeFile(`${sylDir}/${v}.wav`,wav(audio))}
  for(const c of consonants){await writeFile(`${soundDir}/${safe(c)}.wav`,wav(consonant(c)));for(const v of VOWELS)await writeFile(`${sylDir}/${safe(c+v)}.wav`,wav(join(consonant(c),vowel(v))))}
}
console.log('Paquete de sonidos y sílabas generado.');
