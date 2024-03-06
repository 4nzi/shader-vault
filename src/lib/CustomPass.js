import { Vector2 } from 'three'

const CustomPass = {
	name: 'postProcessintgShader',

	uniforms: {
		tDiffuse: { value: null },
		tSize: { value: new Vector2(256, 256) },
	},

	vertexShader: /* glsl */ `
		varying vec2 vUv;

		void main() {
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
			vUv = uv;

		}`,

	fragmentShader: /* glsl */ `
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 color = texture2D( tDiffuse, vUv);

			gl_FragColor = color;
		}`,
}

export { CustomPass }
