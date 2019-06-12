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

function startWebGl(fragmetShaderText, vertexShaderText) {
  const gl = new WebGl({ canvasId: 'gl', vertexShaderText, fragmetShaderText })

  gl.startProgram()
}

class WebGl {
  constructor({ canvasId, vertexShaderText, fragmetShaderText }) {
    this.canvas = document.getElementById(canvasId)
    this.context = this.canvas.getContext('webgl')
    this.program = this.context.createProgram()
    
    this.setCanvasSize()
        .createShader('VERTEX_SHADER', vertexShaderText)
        .createShader('FRAGMENT_SHADER', fragmetShaderText)
        .validateProgram()
        .createBuffer()
        .drawFigure()
        .clearCanvas()
  }

  createBuffer() {
    const { context } = this
    this.vertextBuffer = context.createBuffer()

    const { ARRAY_BUFFER } = context
    context.bindBuffer(ARRAY_BUFFER, this.vertextBuffer)
  
    return this
  }

  drawFigure() {
    const vertextArray = [
    //  X  Y  R  G  B
      0.5, 0.5, 0.0, 1.0, 0.1, 0.4, // element per iteration
      0.5, -0.5, 0.0, 0.8, 0.0, 0.2,
      -0.5, -0.5, 0.0, 1.0, 0.0, 0.4,
      
      -0.5, -0.5, 0.5, 1.0, 0.0, 0.4,
      -0.5, 0.5, 0.5, 0.8, 0.0, 0.2,
      0.5, 0.5, 0.5, 1.0, 0.1, 0.4,
    ]
    const { context } = this
    const {
      ARRAY_BUFFER,
      STATIC_DRAW,
    } = context
    const floatedVertextArray = new Float32Array(vertextArray)
    context.bufferData(ARRAY_BUFFER, floatedVertextArray, STATIC_DRAW)
    
    const vertextElementQuantity = 6
    this.enableAttribute('vertexPosition', vertextElementQuantity, 3, 0)
    this.enableAttribute('vertexColor', vertextElementQuantity, 3, 3)

    return this
  }

  enableAttribute(attributeName, vertexElementsQuantity, attributeElementsQuantity, offset) {
    const { context } = this
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
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
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

  startProgram() {
    const { context } = this
    context.useProgram(this.program)
    console.log(context.TRIANGLES, context.LINES, context.LINE_LOOP, context.LINE_STRIP, context.POINTS)
    context.drawArrays(
      // one of [context.TRIANGLES, context.LINES, context.LINE_LOOP, context.LINE_STRIP, context.POINTS]
      context.TRIANGLES, // графичекий примитив
      0, // стартовый индекс отрисовки
      6 // количество вершин
    )

    return this
  }
}