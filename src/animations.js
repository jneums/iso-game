function createAnimations(scene) {
  //  Our player animations, turning, walking left and walking right.
  scene.anims.create({
    key: 'knight_west_walk',
    frames: scene.anims.generateFrameNames('knight',
                {
                  start: 0,
                  end: 16,
                  zeroPad: 2,
                  prefix: 'knight_west_walk',
                  suffix: '.png'
                }),

    frameRate: 8,
    repeat: -1,

    })
let textures = [ 'skeleton' ];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < motions.length; j++) {
      scene.anims.create({
        key: 'skeleton' + '_' + motions[j] + '_' + directionNames[i],
        frames: scene.anims.generateFrameNames('skeleton',
                    {
                      start: anims[motions[j]].startFrame + directions[directionNames[i]].offset,
                      end: anims[motions[j]].endFrame + directions[directionNames[i]].offset,
                    }),

        frameRate: anims[motions[j]].frameRate,
        repeat: anims[motions[j]].repeat,
        yoyo: anims[motions[j]].yoyo,
        })
      }

    }



 }

//    140-200
//walk 0-16, run 17-27, idle 28-40, attack 41-58
var knightAnims = {
  idle: {
    startFrame: 28,
    endFrame: 40,
    frameRate: 3,
    repeat: -1,
    yoyo: true,

  },
  walk: {
    startFrame: 0,
    endFrame: 16,
    frameRate: 8,
    repeat: -1,
  },
  attack: {
    startFrame: 41,
    endFrame: 58,
    frameRate: 10,
    repeat: 0,
  },
}


var directions = {
  west: { offset: 0, x: -2, y: 0, opposite: 'east' },
  northWest: { offset: 32, x: -2, y: -1, opposite: 'southEast' },
  north: { offset: 64, x: 0, y: -2, opposite: 'south' },
  northEast: { offset: 96, x: 2, y: -1, opposite: 'southWest' },
  east: { offset: 128, x: 2, y: 0, opposite: 'west' },
  southEast: { offset: 160, x: 2, y: 1, opposite: 'northWest' },
  south: { offset: 192, x: 0, y: 2, opposite: 'north' },
  southWest: { offset: 224, x: -2, y: 1, opposite: 'northEast' },
};

var anims = {
  idle: {
    startFrame: 0,
    endFrame: 3,
    frameRate: 3,
    repeat: -1,
    yoyo: true,

  },
  walk: {
    startFrame: 4,
    endFrame: 11,
    frameRate: 8,
    repeat: -1,
  },
  attack: {
    startFrame: 12,
    endFrame: 19,
    frameRate: 10,
    repeat: 0,
  },
  die: {
    startFrame: 20,
    endFrame: 27,
    frameRate: 10,
    repeat: 0,
  },
  shoot: {
    startFrame: 28,
    endFrame: 32,
    frameRate: 5,
    repeat: 1,
    yoyo: true,
  },
};

var directionNames = Object.keys(directions)
var motions = Object.keys(anims);
var knightMotions = Object.keys(knightAnims);

export { createAnimations, directionNames, motions };
