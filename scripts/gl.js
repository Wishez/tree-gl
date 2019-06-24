const startWebGl = (fragmetShaderText, vertexShaderText) => {
  const gl = new WebGl({ canvasId: 'gl', vertexShaderText, fragmetShaderText })
  const { canvas } = gl
  // canvas.addEventListener('click', (event) => {
  //   const { clientX, clientY } = event
  //   gl.pushVertex(clientX, clientY)
  //   gl.draw()
  // })

  const defaultX = 50
  let [translateX, translateY] = [0, 0]
  const drawF = () => gl.drawF(defaultX, canvas.width / 2, translateX, translateY)

  drawF()
  document.addEventListener('keydown', (event) => {
    const { keyCode } = event
    switch (keyCode) {
      case 38: // top
        translateY += 1 
        break;
      case 39: // right
        translateX += 1
        break;
      case 40: // bottom
        translateY -= 1
        break;
      case 37: // left
        translateX -= 1
        break;
      default:
    }
  
    const isArrowPressed = [37, 38, 39, 40].some(value => keyCode === value)
    if (isArrowPressed) drawF()
  })
}

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

  drawF(x, y, translateX, translateY) {
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
    let colors = []
    while (colors.length < vertiecesQuantity * 3) {
      colors.push(145, 86, 255)
    }
    colors = colors.slice(0, vertiecesQuantity * 3)
    
    this.setPositions({
      coordinates: letterCoordinates,
    })
      .enableAttribute('a_position', 2, 0)
      .setUniformResolution()
      .setUniform('u_transition', [translateX, translateY], '2fv')
      // .setColors({
      //   colors,
      // })
      // .enableAttribute('a_color', 3, 0, 'UNSIGNED_BYTE', true)
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

  draw() {
    
    this.createBuffer('dynamicPositionsBuffer')
    const { context } = this
    const { ARRAY_BUFFER, DYNAMIC_DRAW } = context
    const floatedVertexArray = new Float32Array(this.vertexArray)
    context.bufferData(ARRAY_BUFFER, floatedVertexArray, DYNAMIC_DRAW)
    this
      .setCanvasSize()
      .enableAttribute('a_position', 2, 0)
      .enableAttribute('a_color', 3, 2)
      .setUniformResolution()
      .clearCanvas()
      .drawVertieces()

    return this
  }

  setUniformResolution() {
    const { width, height } = this
    this.setUniform('u_resolution', [width, height], '2fv')

    return this
  }

  setUniform(uniformName, values, type) {
    const { context, program } = this
    const functionName = `uniform${type}`
    const uniformLink = context.getUniformLocation(program, uniformName)
    context[functionName](uniformLink, values)

    return this
  }

  enableAttribute(attributeName, attributeElementsQuantity, offset, type, isNormalized) {
    const { context, vertexElementsQuantity, program } = this
    const { BYTES_PER_ELEMENT } = Float32Array
    const attribLocation = context.getAttribLocation(program, attributeName)
    const attribType = context[type || 'FLOAT']
    context.vertexAttribPointer(
      attribLocation, // link to attribute
      attributeElementsQuantity, // quantity elements per iteration of attribute
      attribType, // data type
      isNormalized, // normilize
      vertexElementsQuantity * BYTES_PER_ELEMENT, // elemets on one vertex. second argument change this argument
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