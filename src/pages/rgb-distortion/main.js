import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertex from './shaders/vertex.glsl?raw'
import fragment from './shaders/fragment.glsl?raw'
import GUI from 'lil-gui'
import PointerState from '/lib/PointerState.js'
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
// import { CustomPass } from './lib/CustomPass.ts'

export default class Sketch {
	constructor(options) {
		this.scene = new THREE.Scene()
		this.container = options.dom
		this.width = this.container.offsetWidth
		this.height = this.container.offsetHeight
		this.materials = []
		this.meshes = []
		this.renderer = new THREE.WebGLRenderer()
		this.raycaster = new THREE.Raycaster()

		// uniforms
		this.time = 0
		this.pointerState = new PointerState(this.renderer.domElement)
		this.container.addEventListener('mousemove', this.mouseMove.bind(this), true)

		// setup scene
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		this.renderer.setSize(this.width, this.height)
		this.renderer.setClearColor(0x333333, 1)
		this.container.appendChild(this.renderer.domElement)

		// setup camera
		this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000)
		this.camera.position.set(0, 0, 2)

		// debug settings
		this.debug({ axes: false, grid: false, orbit: false, gui: true })

		this.addObjects()
		this.resize()
		this.render()
		this.setupResize()

		window.addEventListener('pointermove', this.onPointerMove.bind(this))
	}

	setupResize() {
		window.addEventListener('resize', this.resize.bind(this))
	}

	onPointerMove(event) {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

		const intersects = this.raycaster.intersectObjects(this.scene.children)

		console.log(intersects[0].point)

		if (intersects.length > 0) {
			this.materials[0].uniforms.mouse.value = intersects[0].point
		}
	}

	resize() {
		this.width = this.container.offsetWidth
		this.height = this.container.offsetHeight
		this.renderer.setSize(this.width, this.height)
		this.camera.aspect = this.width / this.height
		this.camera.updateProjectionMatrix()
	}

	mouseMove(e) {
		this.mx = e.offsetX / this.width
		this.my = e.offsetY / this.height
	}

	debug(options = {}) {
		if (options?.axes) this.scene.add(new THREE.AxesHelper(5))
		if (options?.grid) this.scene.add(new THREE.GridHelper(10, 10))
		if (options?.orbit) new OrbitControls(this.camera, this.renderer.domElement)

		if (options?.gui) {
			const settings = {
				progress: 0,
			}
			const gui = new GUI()
			gui.add(settings, 'progress', -1, 1, 0.001).onChange(() => {
				this.materials[0].uniforms.progress.value = settings.progress
			})
		}
	}

	addObjects() {
		let mat = new THREE.ShaderMaterial({
			extensions: {
				derivatives: true,
			},
			side: THREE.DoubleSide,
			uniforms: {
				progress: { value: 0 },
				time: { value: 0 },
				resolution: { value: new THREE.Vector4() },
				mouse: { type: 'v3', value: new THREE.Vector3() },
				tex: { value: new THREE.TextureLoader().load('./img/img01.jpg') },
				displacement: { value: new THREE.TextureLoader().load('./img/img02.jpg') },
			},
			transparent: true,
			vertexShader: vertex,
			fragmentShader: fragment,
		})
		this.materials.push(mat)

		const geo = new THREE.PlaneGeometry(2, 2, 1, 1)
		console.log(geo)
		const plane = new THREE.Mesh(geo, mat)
		this.scene.add(plane)
	}

	update() {}
	initPost() {}

	render() {
		this.time += 0.05
		this.pointerState.update()

		this.materials[0].uniforms.time.value = this.time
		this.materials[0].uniforms.mouse.value = this.pointer

		requestAnimationFrame(this.render.bind(this))
		this.renderer.render(this.scene, this.camera)
	}
}

const dom = document.getElementById('root')
if (!dom) throw new Error('dom not found')

new Sketch({
	dom: dom,
})
