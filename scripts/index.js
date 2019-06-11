

const CONTAINER = (function() {
    const main = document.querySelector('main')

    return {
        add(element) {
            main.appendChild(element)
        },

        removeCanvas() {
            Array.from(main.children)
                .forEach(element => {
                    if (element.tagName === 'CANVAS') {
                        element.remove()
                    }
                })
        }
    }
}())


const CAMERA = (function() {
    let camera;
    return {
        create({ width, height, FOV = 75, nearPlane = .1, farPlane = 1000}) {
            camera = new THREE.PerspectiveCamera(FOV, width/height, nearPlane, farPlane)
            return camera
        },

        get: () => camera
    }
}())

const SCENE = (function() {
    let scene;
    return {
        create(background = '#333333') {
            scene = new THREE.Scene(background)
            scene.background = background
            console.log(scene)
            return scene
        },

        get: () => scene
    }
}())

const RENDERER = (function() {
    let renderer;
    return {
        create({ width, height, updateStyle = true }) {
            renderer = new THREE.WebGLRenderer()
            renderer.setSize(width, height, updateStyle)
            return renderer
        },

        get: () => renderer,

        getDomElement: () => renderer.domElement 
    }
}())

function makeFigure() {
    const width = window.innerWidth
    const height = window.innerHeight

    const camera = CAMERA.create({ width, height })
    const scene = SCENE.create('#ffff99')

    const renderer = RENDERER.create({ width, height, isOptimized: true })
    const rendererDomElement = RENDERER.getDomElement()
    CONTAINER.add(rendererDomElement)
    
    const geometry = new THREE.BoxGeometry(2, 1, 1)
    const material = new THREE.MeshBasicMaterial({
        color: 0xce74ee,
        // wireframe: true,
        reflectivity: .9,
        refractionRatio: 1,
        vertexColors: THREE.FaceColors,
        // lights: true,
        morphTargets: true,
        skinning: true
        
    })
    const cube = new THREE.Mesh(geometry, material)
    
    scene.add(cube)
    
    camera.position.z = 4
    console.log(cube.rotation)
    const animate = () => {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        cube.rotation.x += .01
        cube.rotation.y += .01
    }
    animate()
}

makeFigure()
window.addEventListener('resize', _.throttle(() => {
    console.log('reinit canvas')
    CONTAINER.removeCanvas()
    makeFigure()
}, 1000))