const fs = require('fs');

const wtm = JSON.parse(fs.readFileSync('WTMProject.wtm', 'utf8'));

let total = 0;
wtm.panoramas.forEach(p => {
  p.hotspots.forEach(hs => {
    total++;
    const [x, y, z] = hs.position.split(',').map(Number);
    const R = Math.sqrt(x*x + y*y + z*z);
    const Rh = Math.sqrt(x*x + z*z);

    let phi = Math.atan2(z, x);
    let yaw = phi - Math.PI;
    while (yaw > Math.PI) yaw -= 2 * Math.PI;
    while (yaw < -Math.PI) yaw += 2 * Math.PI;

    const pitch = Math.atan2(y, Rh);
    const pitchDeg = pitch * 180 / Math.PI;

    if (Math.abs(pitchDeg) > 45) {
      console.log(`High pitch: ${p.panofile} -> ${hs.title}: pitch=${pitchDeg.toFixed(1)}°`);
    }
  });
});

console.log(`Tested ${total} hotspots.`);
