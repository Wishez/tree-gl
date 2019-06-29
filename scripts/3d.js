window.addEventListener('load', () => {
    const context = '3d'
    if (Util.shouldStartPGLrogram(context)) {
        Util.loadShaders(context)
            .then(({ VSText, FSText }) => startDrawNameFigure(FSText, VSText))
    }
})

const m4 = Util.m4

class NameFigure extends WebGL {

    drawNameFigure(props) {
        const { 
            translateX, translateY, translateZ,
            rotateXAngle, rotateYAngle, rotateZAngle,
            scaleX, scaleY, scaleZ,
        } = props
        const top = 0
        const bottom = 150
        const left = 0
        const right = 200
        // const coordinates = [
        //     75, top, 30,
        //     82.5, top, 30,
        //     50, 50, 30,
        //     50, 50, 30,
        //     57.5, 50, 30,
        //     82.5, 0, 30,
        // ]
        const coordinates = [
            // left column front
              0,   0,  0, 0.3, 0.5, 1,
             30,   0,  0, 0.3, 0.5, 1,
              0, 150,  0, 0.3, 0.5, 1,
              0, 150,  0, 0.3, 0.5, 1,
             30,   0,  0, 0.3, 0.5, 1,
             30, 150,  0, 0.3, 0.5, 1,
  
            // top rung front
             30,   0,  0, 0.3, 0.5, 1,
            100,   0,  0, 0.3, 0.5, 1,
             30,  30,  0, 0.3, 0.5, 1,
             30,  30,  0, 0.3, 0.5, 1,
            100,   0,  0, 0.3, 0.5, 1,
            100,  30,  0, 0.3, 0.5, 1,
  
            // middle rung front
             30,  60,  0, 0.3, 0.5, 1,
             67,  60,  0, 0.3, 0.5, 1,
             30,  90,  0, 0.3, 0.5, 1,
             30,  90,  0, 0.3, 0.5, 1,
             67,  60,  0, 0.3, 0.5, 1,
             67,  90,  0, 0.3, 0.5, 1,
  
            // left column back
              0,   0,  30, 99, 0, 181,
             30,   0,  30, 99, 0, 181,
              0, 150,  30, 99, 0, 181,
              0, 150,  30, 99, 0, 181,
             30,   0,  30, 99, 0, 181,
             30, 150,  30, 99, 0, 181,
  
            // top rung back
             30,   0,  30, 99, 0, 181,
            100,   0,  30, 99, 0, 181,
             30,  30,  30, 99, 0, 181,
             30,  30,  30, 99, 0, 181,
            100,   0,  30, 99, 0, 181,
            100,  30,  30, 99, 0, 181,
  
            // middle rung back
             30,  60,  30, 99, 0, 181, 
             67,  60,  30, 99, 0, 181,
             30,  90,  30, 99, 0, 181,
             30,  90,  30, 99, 0, 181,
             67,  60,  30, 99, 0, 181,
             67,  90,  30, 99, 0, 181,
  
            // top
              0,   0,   0, 237, 0, 47,
            100,   0,   0, 237, 0, 47,
            100,   0,  30, 237, 0, 47,
              0,   0,   0, 237, 0, 47,
            100,   0,  30, 237, 0, 47,
              0,   0,  30, 237, 0, 47,
  
            // top rung right
            100,   0,   0, 237, 0, 47,
            100,  30,   0, 237, 0, 47,
            100,  30,  30, 237, 0, 47,
            100,   0,   0, 237, 0, 47,
            100,  30,  30, 237, 0, 47,
            100,   0,  30, 237, 0, 47,
  
            // under top rung
            30,   30,   0, 237, 0, 47,
            30,   30,  30, 237, 0, 47,
            100,  30,  30, 237, 0, 47,
            30,   30,   0, 237, 0, 47,
            100,  30,  30, 237, 0, 47,
            100,  30,   0, 237, 0, 47,
  
            // between top rung and middle
            30,   30,   0, 237, 0, 47,
            30,   30,  30, 237, 0, 47,
            30,   60,  30, 237, 0, 47,
            30,   30,   0, 237, 0, 47,
            30,   60,  30, 237, 0, 47,
            30,   60,   0, 237, 0, 47,
  
            // top of middle rung
            30,   60,   0, 237, 0, 47,
            30,   60,  30, 237, 0, 47,
            67,   60,  30, 237, 0, 47,
            30,   60,   0, 237, 0, 47,
            67,   60,  30, 237, 0, 47,
            67,   60,   0, 237, 0, 47,
  
            // right of middle rung
            67,   60,   0, 237, 0, 47,
            67,   60,  30, 237, 0, 47,
            67,   90,  30, 237, 0, 47,
            67,   60,   0, 237, 0, 47,
            67,   90,  30, 237, 0, 47,
            67,   90,   0, 237, 0, 47,
  
            // bottom of middle rung.
            30,   90,   0, 237, 0, 47,
            30,   90,  30, 237, 0, 47,
            67,   90,  30, 237, 0, 47,
            30,   90,   0, 237, 0, 47,
            67,   90,  30, 237, 0, 47,
            67,   90,   0, 237, 0, 47,
  
            // right of bottom
            30,   90,   0, 237, 0, 47,
            30,   90,  30, 237, 0, 47,
            30,  150,  30, 237, 0, 47,
            30,   90,   0, 237, 0, 47,
            30,  150,  30, 237, 0, 47,
            30,  150,   0, 237, 0, 47,
  
            // bottom
            0,   150,   0, 237, 0, 47,
            0,   150,  30, 237, 0, 47,
            30,  150,  30, 237, 0, 47,
            0,   150,   0, 237, 0, 47,
            30,  150,  30, 237, 0, 47,
            30,  150,   0, 237, 0, 47,
  
            // left side
            0,   0,   0, 237, 0, 47,
            0,   0,  30, 237, 0, 47,
            0, 150,  30, 237, 0, 47,
            0,   0,   0, 237, 0, 47,
            0, 150,  30, 237, 0, 47,
            0, 150,   0, 237, 0, 47,
        ]

        const vertiecesQuantity = coordinates.length / 6
        const { clientWidth, clientHeight } = this.canvas
        const projectionMatrix = m4.projection(clientWidth, clientHeight, 400)
        let matrix
        matrix = m4.scale(projectionMatrix, scaleX, scaleY, scaleZ)
        matrix = m4.translate(matrix, translateX, translateY, translateZ)
        matrix = m4.rotateX(matrix, rotateXAngle)
        matrix = m4.rotateY(matrix, rotateYAngle)
        matrix = m4.rotateZ(matrix, rotateZAngle)
        this.setPositions({ coordinates })
          .enableAttribute({
            attributeName: 'a_position',
            attributeElementsQuantity: 3,
            vertexElementsQuantity: 6,
          })
          .enableAttribute({
            attributeName: 'a_color',
            attributeElementsQuantity: 3,
            vertexElementsQuantity: 6,
            offset: 4,
            isNormalized: true,
            type: 'UNSIGNED_BYTE',
            SpecialArray: Uint8Array,
          })
          .setUniform('u_matrix', 'Matrix4fv', false, matrix)
          .clearCanvas()
          .drawVertieces(vertiecesQuantity)
    }
}

function startDrawNameFigure(fragmetShaderText, vertexShaderText) {
  const gl = new NameFigure({ canvasId: 'gl', vertexShaderText, fragmetShaderText })
  const { clientHeight, clientWidth } = gl.canvas
  let [translateX, translateY, translateZ] = [50, 100, 0]
  let [rotateXAngle, rotateYAngle, rotateZAngle] = [getAngleInRadians(45), getAngleInRadians(20), getAngleInRadians(300)]
  let [scaleX, scaleY, scaleZ] = [1, 1, 1]
  const drawNameFigure = () => gl.drawNameFigure({
    x: 0, 
    y: 0,
    translateX, translateY, translateZ,
    rotateXAngle, rotateYAngle, rotateZAngle,
    scaleX, scaleY, scaleZ,
  })
  drawNameFigure()

  const $rangeInputs = Util.getEl('#rangeInputs')
  const inputs = [
    {
      name: 'translateX',
      max: clientWidth,
      min: -clientWidth,
      step: 0.05,
      $container: $rangeInputs,
      onChange: (value) => {
        translateX = value
        drawNameFigure()
      }
    },
    {
      name: 'translateY',
      max: clientHeight,
      min: -clientHeight,
      step: 0.05,
      $container: $rangeInputs,
      onChange: (value) => {
        translateY = value
        drawNameFigure()
      }
    },
    {
        name: 'translateZ',
        max: clientHeight,
        min: -clientHeight,
        step: 0.05,
        $container: $rangeInputs,
        onChange: (value) => {
            translateZ = value
            drawNameFigure()
        }
    },
    {
      name: 'angleX',
      max: 360,
      $container: $rangeInputs,
      onChange: (angle) => {
        rotateXAngle = getAngleInRadians(angle)
        drawNameFigure()
      },
    },
    {
        name: 'angleY',
        max: 360,
        $container: $rangeInputs,
        onChange: (angle) => {
           rotateYAngle = getAngleInRadians(angle)
           drawNameFigure()
        },
      },
      {
        name: 'angleZ',
        max: 360,
        $container: $rangeInputs,
        onChange: (angle) => {
          rotateZAngle = getAngleInRadians(angle)
          drawNameFigure()
        },
      },
      {
        name: 'scale',
        max: 10,
        min: -5,
        value: 1,
        step: 0.05,
        $container: $rangeInputs,
        onChange: (value) => {
            scaleX = value
            scaleY = value
            drawNameFigure()
        },
      },
      {
        name: 'scaleZ',
        max: 10,
        min: -5,
        value: 1,
        step: 0.05,
        $container: $rangeInputs,
        onChange: (value) => {
            scaleZ = value
            drawNameFigure()
        },
      }
  ]

  Util.createRangeInputs(inputs)
  window.addEventListener('resize', () => {
    gl.setCanvasSize()
    drawNameFigure()
  })
}

function getAngleInRadians(angle) {
    return angle * Math.PI / 180
}