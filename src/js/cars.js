// ===================================================
// AURA CAR - CAR DATA & 3D F1 MODEL FACTORY
// ===================================================

var CARS = [
  { id:'scuderia', name:'Scuderia Rosso', team:'Equipe Vermelha', badge:'🔴', color:0xee1122, topSpeedKmh:335, accel:36, grip:1.35, desc:'Velocidade máxima avassaladora (335 km/h)' },
  { id:'bull',     name:'Thunder Bull',   team:'Equipe Azul',     badge:'🔵', color:0x0055ff, topSpeedKmh:328, accel:39, grip:1.40, desc:'Arrancadas e retomadas explosivas' },
  { id:'papaya',   name:'Papaya Orange',  team:'Equipe Laranja',  badge:'🟠', color:0xff7700, topSpeedKmh:326, accel:35, grip:1.50, desc:'Frenagem e contorno de curva perfeito' },
  { id:'mercedes', name:'Silver Arrow',   team:'Equipe Prata',    badge:'⚪', color:0xd0d0d8, topSpeedKmh:330, accel:37, grip:1.38, desc:'Equilíbrio e aerodinâmica refinada' },
  { id:'british',  name:'Apex Emerald',   team:'Equipe Verde',    badge:'🟢', color:0x00aa44, topSpeedKmh:324, accel:38, grip:1.55, desc:'Aderência extrema em curvas de alta' }
];

var RIVAL_NAMES = [
  { name: 'Max V.',      team: 'Bull',     color: 0x0033aa },
  { name: 'Lewis H.',    team: 'Silver',   color: 0xcccccc },
  { name: 'Charles L.',  team: 'Scuderia', color: 0xcc0011 },
  { name: 'Lando N.',    team: 'Papaya',   color: 0xff6600 },
  { name: 'Fernando A.', team: 'Apex',     color: 0x008833 }
];

function createFullF1CarMesh(colorHex, isPlayer) {
  var g = new THREE.Group();
  var teamMat = toonMat(colorHex);
  var carbonMat = toonMat(0x181a20);
  var chromeMat = toonMat(0xbbbbbb);
  var redMat = toonMat(0xff1122);

  // 1. Monocoque Central
  var chassis = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.48, 3.8), teamMat);
  chassis.position.y = 0.44; chassis.castShadow = true; g.add(chassis);

  // 2. Bico Alongado Aerodinâmico de F1
  var nose = new THREE.Mesh(new THREE.ConeGeometry(0.38, 2.4, 6), teamMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.set(0, 0.38, 2.8);
  nose.castShadow = true; g.add(nose);

  // 3. Cockpit & Abertura
  var cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.5, 1.4), carbonMat);
  cockpit.position.set(0, 0.72, 0.1); g.add(cockpit);

  // Entrada de Ar do Motor (Airbox Scoop)
  var airbox = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.9), teamMat);
  airbox.position.set(0, 1.15, -0.6); airbox.castShadow = true; g.add(airbox);

  var airboxHole = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.2), carbonMat);
  airboxHole.position.set(0, 1.25, -0.15); g.add(airboxHole);

  // 4. Halo de F1 com Suporte Central
  var haloPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), carbonMat);
  haloPillar.position.set(0, 0.95, 0.55);
  haloPillar.rotation.x = Math.PI / 8;
  g.add(haloPillar);

  var haloArch = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 6, 14, Math.PI), carbonMat);
  haloArch.rotation.x = -Math.PI / 2.2;
  haloArch.position.set(0, 1.18, 0.25);
  g.add(haloArch);

  // 5. Piloto com Capacete Colorido
  var helmetColor = isPlayer ? 0xffdd00 : (colorHex ^ 0x335577);
  var helmet = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), toonMat(helmetColor));
  helmet.position.set(0, 0.95, 0.05); helmet.castShadow = true; g.add(helmet);

  var visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.2), toonMat(0x111122));
  visor.position.set(0, 0.95, 0.2); g.add(visor);

  // 6. Asa Dianteira (Front Wing) com Endplates
  var fwMain = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.75), carbonMat);
  fwMain.position.set(0, 0.24, 3.7); fwMain.castShadow = true; g.add(fwMain);

  var fwFlap = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.35), teamMat);
  fwFlap.position.set(0, 0.32, 3.6); g.add(fwFlap);

  var fwPlateL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.8), teamMat);
  fwPlateL.position.set(1.48, 0.32, 3.7); g.add(fwPlateL);
  var fwPlateR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.8), teamMat);
  fwPlateR.position.set(-1.48, 0.32, 3.7); g.add(fwPlateR);

  // 7. Asa Traseira (Rear Wing) com Suportes
  var rwMain = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.65, 0.12), teamMat);
  rwMain.position.set(0, 1.25, -2.1); rwMain.castShadow = true; g.add(rwMain);

  var rwPlateL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.65), carbonMat);
  rwPlateL.position.set(1.1, 1.15, -2.1); g.add(rwPlateL);
  var rwPlateR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.65), carbonMat);
  rwPlateR.position.set(-1.1, 1.15, -2.1); g.add(rwPlateR);

  var rwPillars = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 0.5), carbonMat);
  rwPillars.position.set(0, 0.85, -1.9); g.add(rwPillars);

  // Luz de Chuva / Freio Traseira
  var rainLight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.08), redMat);
  rainLight.position.set(0, 0.35, -2.15); g.add(rainLight);

  // 8. Pontões Laterais (Sidepods)
  var spL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 2.1), teamMat);
  spL.position.set(0.9, 0.42, 0.1); spL.castShadow = true; g.add(spL);
  var spR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 2.1), teamMat);
  spR.position.set(-0.9, 0.42, 0.1); spR.castShadow = true; g.add(spR);

  var spIntakeL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 0.1), carbonMat);
  spIntakeL.position.set(0.9, 0.45, 1.15); g.add(spIntakeL);
  var spIntakeR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 0.1), carbonMat);
  spIntakeR.position.set(-0.9, 0.45, 1.15); g.add(spIntakeR);

  // 9. 4 Rodas Largas Slick de F1
  var wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.56, 18);
  var rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.58, 12);
  var tireMat = toonMat(0x1a1a1c);
  var rimMat = toonMat(0xd8d8d8);

  var wheelMeshes = [];
  var wheelPositions = [
    [ 1.25, 0.28,  1.7, true],
    [-1.25, 0.28,  1.7, true],
    [ 1.25, 0.28, -1.6, false],
    [-1.25, 0.28, -1.6, false]
  ];

  wheelPositions.forEach(function(wp) {
    var pivot = new THREE.Group();
    pivot.position.set(wp[0], wp[1], wp[2]);

    var tire = new THREE.Mesh(wheelGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    pivot.add(tire);

    var rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    pivot.add(rim);

    var axle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), chromeMat);
    axle.rotation.z = (wp[0] > 0) ? -Math.PI/6 : Math.PI/6;
    axle.position.set(wp[0] > 0 ? -0.3 : 0.3, 0.05, 0);
    g.add(axle);

    g.add(pivot);
    wheelMeshes.push({ group: pivot, isFront: wp[3] });
  });

  g.userData.wheels = wheelMeshes;
  g.userData.helmet = helmet;
  g.userData.rainLight = rainLight;
  return g;
}
