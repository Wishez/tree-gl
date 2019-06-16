const startWebGl = (fragmetShaderText, vertexShaderText) => {
  const gl = new WebGl({ canvasId: 'gl', vertexShaderText, fragmetShaderText })
  const { canvas } = gl
  canvas.addEventListener('click', (event) => {
    const { clientX, clientY } = event
    gl.pushVertex(clientX, clientY)
    gl.draw()
  })

  document.addEventListener('keydown', (event) => {
    const { keyCode } = event
    const deleteKeyCode = 46
    if (keyCode === deleteKeyCode) {
      gl.clearVertexArray()
    } 
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
        .clearCanvas()
  }

  clearVertexArray() {
    const { vertexArray, vertexElementsQuantity } = this
    const vertexArrayLenth = vertexArray.length

    this.vertexArray = vertexArray.slice(0, vertexArrayLenth - vertexElementsQuantity)
    this.draw()
    if (this.vertexArray.length) setTimeout(() => this.clearVertexArray(), 150)
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

  createBuffer() {
    const { context } = this
    this.vertexBuffer = context.createBuffer()

    const { ARRAY_BUFFER } = context
    context.bindBuffer(ARRAY_BUFFER, this.vertexBuffer)
  
    return this
  }

  draw() {
    this.createBuffer()
    const { context, canvas } = this
    const { ARRAY_BUFFER, STATIC_DRAW } = context
    const floatedVertexArray = new Float32Array(this.vertexArray)
    context.bufferData(ARRAY_BUFFER, floatedVertexArray, STATIC_DRAW)
    console.log(canvas.width, canvas.height)
    this
      .setCanvasSize()
      .enableAttribute('a_position', 2, 0)
      .enableAttribute('a_vertexColor', 3, 2)
      .setUniform('u_resolution', [canvas.width, canvas.height], '2fv')
      .clearCanvas()
      .drawVerteces()

    return this
  }

  setUniform(uniformName, values, type) {
    const { context, program } = this
    const functionName = `uniform${type}`
    const uniformLink = context.getUniformLocation(program, uniformName)
    context[functionName](uniformLink, values)

    return this
  }

  enableAttribute(attributeName, attributeElementsQuantity, offset) {
    const { context, vertexElementsQuantity } = this
    const { FLOAT, FALSE } = context
    const { BYTES_PER_ELEMENT } = Float32Array
    const attribLocation = context.getAttribLocation(this.program, attributeName)
    context.vertexAttribPointer(
      attribLocation, // link to attribute
      attributeElementsQuantity, // quantity elements per iteration of attribute
      FLOAT, // data type
      FALSE, // normilize
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

  drawVerteces() {
    const { context } = this
    context.useProgram(this.program)
    // console.log(context.TRIANGLES, context.LINES, context.LINE_LOOP, context.LINE_STRIP, context.POINTS)
    context.drawArrays(
      // one of [context.TRIANGLES, context.TRIANGLES_STRIP, context.TRIANGLES_FUN, context.LINES, context.LINE_LOOP, context.LINE_STRIP, context.POINTS]
      context.TRIANGLE_FAN, // графичекий примитив
      0, // стартовый индекс отрисовки
      this.vertiecesQuantity // количество вершин
    )


    return this
  }
}