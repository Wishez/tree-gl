class Util {
  static domShaderSrc(url) {
    const request = new XMLHttpRequest(url)
    return new Promise((resolve, reject) => {
      request.onreadystatechange = (event) => {
        const { status, responseText } = event.target
        if (responseText && status === 200) resolve(responseText)
        if ([404, 500].some(code => code === status)) reject(`Error: HTTP status - ${status} on resource ${url}`)
      }

      request.open('GET', url)
      request.send()
    })
  }
}
