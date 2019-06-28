window.addEventListener('load', () => {
  let [VSText, FSText] = ['', ''];
  Util.domShaderSrc('/shaders/vertex.glsl')
    .then((responseText) => {
      VSText = responseText

      return Util.domShaderSrc('/shaders/fragment.glsl')
    })
    .then((responseText) => {
      FSText = responseText

      return startWebGl(FSText, VSText)
    })
    .catch(error => console.error(error))
})

const m3 = (function() {
  const FIRST = 'first'
  const SECOND = 'second'
  const THIRD = 'third'
  const that = { 
    projection: (width, height) => ([
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1,
    ]),

    identity: () => ([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ]),

    rotation: (angleInRadians) => {
      const s = Math.sin(angleInRadians)
      const c = Math.cos(angleInRadians)
      return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
      ]
    },

    transition: (x, y) => ([
      1, 0, 0,
      0, 1, 0,
      x, y, 1,
    ]),


    scaling: (x, y) => ([
      x, 0, 0,
      0, y, 0,
      0, 0, 1,
    ]),

    multiply: (a, b) => {
      const factorValues = {
        [FIRST]: [],
        [SECOND]: [],
        [THIRD]: []
      }
      for(let i = 0; i < 3; i++) {
        factorValues[FIRST].push(a[i * 3 + 0])
        factorValues[SECOND].push(a[i * 3 + 1])
        factorValues[THIRD].push(a[i * 3 + 2])
      }
    
      const [firstX, firstY, firstZ] = factorValues[FIRST]
      const [secondX, secondY, secondZ] = factorValues[SECOND]
      const [thirdX, thirdY, thirdZ] = factorValues[THIRD]
      const multipliedMatrix = []
      for (let i = 0; i < 3; i++) {
        const [x, y, z] = [b[i * 3 + 0], b[i * 3 + 1], b[i * 3 + 2]]
        multipliedMatrix.push(
          x * firstX + y * firstY + z * firstZ,
          x * secondX + y * secondY + z * secondZ,
          x * thirdX + y * thirdY + z * thirdZ,
        )
      }
      return multipliedMatrix
    },

    translate: (matrix, x, y) => that.multiply(matrix, that.transition(x, y)),

    rotate: (matrix, angleInRadians) => that.multiply(matrix, that.rotation(angleInRadians)),

    scale: (matrix, x, y) => that.multiply(matrix, that.scaling(x, y)),
  }
  return that
}())

class WebGl {
  constructor({ canvasId, vertexShaderText, fragmetShaderText }) {
    this.canvas = document.getElementById(canvasId)
    this.context = this.canvas.getContext('webgl')
    this.program = this.context.createProgram()
    this.vertexArray = []
    this.vertiecesQuantity = 0
    this.vertexElementsQuantity = 5
    this.colors = [
      [1.0, 0.1, 0.4],
      [0.8, 0.0, 0.2],
      [1.0, 0.0, 0.4],
    ]

    this.setCanvasSize()
        .createShader('VERTEX_SHADER', vertexShaderText)
        .createShader('FRAGMENT_SHADER', fragmetShaderText)
        .validateProgram()
        .useProgram()
        .clearCanvas()
  }

  useProgram() {
    this.context.useProgram(this.program)
    return this
  }

  pushVertex(x, y) {
    const { vertexArray, getRandomColor } = this
    const color = getRandomColor.call(this)
    vertexArray.push(x, y, ...color)
    this.vertiecesQuantity += 1

    return this
  }

  getRandomColor() {
    const { colors } = this
    return colors[Math.round(Math.random() * colors.length)]
  }

  createBuffer(bufferName) {
    const { context } = this
    this[bufferName] = context.createBuffer()
    context.bindBuffer(context.ARRAY_BUFFER, this[bufferName])
  
    return this
  }

  drawF(props) {
    const { x, y, translateX, translateY, angleInRadians, scaleX, scaleY } = props
    var width = 100;
    var height = 150;
    var thickness = 30;
    
    const letterCoordinates = [
       // вертикальный столб
       x, y,
       x + thickness, y,
       x, y + height,
       x, y + height,
       x + thickness, y,
       x + thickness, y + height,

       // верхняя перекладина
       x + thickness, y,
       x + width, y,
       x + thickness, y + thickness,
       x + thickness, y + thickness,
       x + width, y,
       x + width, y + thickness,

       // перекладина посередине
       x + thickness, y + thickness * 2,
       x + width * 2 / 3, y + thickness * 2,
       x + thickness, y + thickness * 3,
       x + thickness, y + thickness * 3,
       x + width * 2 / 3, y + thickness * 2,
       x + width * 2 / 3, y + thickness * 3,
    ]

    const vertiecesQuantity = letterCoordinates.length / 2
    // let colors = []
    // while (colors.length < vertiecesQuantity * 3) {
    //   colors.push(145, 86, 255)
    // }
    // colors = colors.slice(0, vertiecesQuantity * 3)

    const { clientWidth, clientHeight } = this.canvas 
    const projectionMatrix = m3.projection(clientWidth, clientHeight)
    let matrix
    matrix = m3.scale(projectionMatrix, scaleX, scaleY)
    matrix = m3.translate(matrix, translateX, translateY)
    matrix = m3.rotate(matrix, angleInRadians)

    this.setPositions({
      coordinates: letterCoordinates,
    })
      .enableAttribute({
        attributeName: 'a_position',
        attributeElementsQuantity: 2,
      })
      // .setUniformResolution()
      // .setUniform('u_transition', '2f', translateX, translateY)
      // .setUniform('u_rotation', '2f', rotateX , rotateY)
      // .setUniform('u_scale', '2f', scaleX, scaleY)
      .setUniform('u_matrix', 'Matrix3fv', false, matrix)
      .setUniform('u_color', '4f', 0.3, 0.5, 1, 1)
      // .setColors({
      //   colors,
      // })
      // .enableAttribute({
      //   attributeName: 'a_color',
      //   attributeElementsQuantity: 3,
      //   type: 'UNSIGNED_BYTE',
      //   isNormalized: true,
      // })
      .clearCanvas()
      .drawVertieces(vertiecesQuantity)
  }

  setColors(props) {
    this.createBuffer('colorsBuffer')
  
    const { colors, drawType = 'STATIC_DRAW' } = props
    const { context } = this

    context.bufferData(context.ARRAY_BUFFER, new Uint8Array(colors), context[drawType])    

    return this
  }

  setPositions(props) {
    this.createBuffer('positionBuffer')

    const { coordinates, drawType = 'STATIC_DRAW' } = props
    const { context } = this
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(coordinates), context[drawType])
    
    return this
  }

  bindBuffer(bufferName) {
    const { context } = this
    context.bindBuffer(context.ARRAY_BUFFER, this[bufferName])

    return this
  }

  setUniformResolution() {
    const { width, height } = this.canvas
    this.setUniform('u_resolution', '2f', width, height)

    return this
  }

  setUniform(uniformName, type, ...values) {
    const { context, program } = this
    const functionName = `uniform${type}`
    const uniformLink = context.getUniformLocation(program, uniformName)
    context[functionName](uniformLink, ...values)

    return this
  }

  enableAttribute(props) {
    const { context, program } = this
    
    const {
      attributeName,
      attributeElementsQuantity,
      offset = 0,
      type = 'FLOAT',
      isNormalized,
      vertexElementsQuantity,
      SpecialArray = Float32Array,
    } = props
    const { BYTES_PER_ELEMENT } = SpecialArray
    const attribLocation = context.getAttribLocation(program, attributeName)
    const attribType = context[type]
    context.vertexAttribPointer(
      attribLocation, // link to attribute
      attributeElementsQuantity, // quantity elements per iteration of attribute
      attribType, // data type
      isNormalized, // normilize
      (vertexElementsQuantity || attributeElementsQuantity) * BYTES_PER_ELEMENT, // elemets on one vertex. second argument change this argument
      offset * BYTES_PER_ELEMENT, // offset
    )
    context.enableVertexAttribArray(attribLocation)

    return this
  }

  createShader(shaderType, shaderText) {
    const { context } = this
    const shader = context.createShader(context[shaderType])
    this[shaderType] = shader
    
    context.shaderSource(shader, shaderText)
    this.compileShader(shaderType)
        .bindShaderWithProgram(shaderType)

    return this
  }

  compileShader(shaderType) {
    const shader = this[shaderType]
    const { context } = this
    
    context.compileShader(shader)
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      throw new Error(`Error compile shader! ${context.getShaderInfoLog(shader)}`)
    }
    return this
  }

  bindShaderWithProgram(shaderType) {
    const { context, program } = this
    const shader = this[shaderType]

    context.attachShader(program, shader)

    return this
  }

  validateProgram() {
    const { context, program } = this
    context.linkProgram(program)
    context.validateProgram(program)

    if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
      throw new Error(`The program is not valid! ${context.getProgramInfoLog(program)}`)
    }

    return this
  }

  setCanvasSize() {
    const { canvas, context } = this
    const { innerHeight: height, innerWidth: width } = window

    canvas.style.width = width
    canvas.style.height = height
    canvas.width = width
    canvas.height = height
    context.viewport(0, 0, width, height)
    canvas.style.opacity = 1

    return this
  }

  clearCanvas() {
    const { context } = this
    context.clearColor(.75, .9, 1.0, 1.0)
    // | context.DEPTH_BUFFER_BIT
    context.clear(context.COLOR_BUFFER_BIT) // очищает буффер глубины (для корректной работы перспективы) и буфер цвета

    return this
  }

  drawVertieces(vertiecesQuantity) {
    const { context } = this
    context.drawArrays(
      // one of [context.TRIANGLES, context.TRIANGLES_STRIP, context.TRIANGLES_FUN, context.LINES, context.LINE_LOOP, context.LINE_STRIP, context.POINTS]
      context.TRIANGLES, // графичекий примитив
      0, // стартовый индекс отрисовки
      vertiecesQuantity || this.vertiecesQuantity // количество вершин
    )

    return this
  }
}

function getEl(selector) {
  return document.querySelector(selector)
}

function createRangeInput(props) {
  const { max = '', min = 0, name, onChange, $container, value = 0, step = 1 } = props
  const $input = document.createElement('input')
  $input.name = name
  $input.min = min
  $input.max = max
  $input.value = value
  $input.type = 'range'
  $input.id = `${name}RangeInput`
  $input.step = step

  const eventHandler = () => onChange($input.value)
  $input.addEventListener('change', eventHandler)
  $input.addEventListener('input', eventHandler)

  if ($container) $container.appendChild($input)
  return $input
}

function startWebGl (fragmetShaderText, vertexShaderText) {
  const gl = new WebGl({ canvasId: 'gl', vertexShaderText, fragmetShaderText })
  const { canvas } = gl
  const defaultX = 50
  let [translateX, translateY] = [0, 0]
  let angleInRadians = 0
  let [scaleX, scaleY] = [1, 1]
  const drawF = () => gl.drawF({
    x: defaultX, 
    y: defaultX,
    translateX,
    translateY,
    angleInRadians,
    scaleX,
    scaleY,
  })
  drawF()

  const $rangeInputs = getEl('#rangeInputs')

  const inputs = [
    {
      name: 'translateX',
      max: canvas.width,
      min: -canvas.width,
      $container: $rangeInputs,
      onChange: (value) => {
        translateX = value
        drawF()
      }
    },
    {
      name: 'translateY',
      max: canvas.height,
      min: -canvas.height,
      $container: $rangeInputs,
      onChange: (value) => {
        translateY = value
        drawF()
      }
    },
    {
      name: 'angle',
      max: 360,
      $container: $rangeInputs,
      onChange: (angle) => {
        angleInRadians = angle * Math.PI / 180
        drawF()
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
        drawF()
      },
    },
  ]

  inputs.forEach(createRangeInput)
  window.addEventListener('resize', () => {
    gl.setCanvasSize()
    drawF()
  })
}
