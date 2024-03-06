import * as fs from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const srcDir = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')
const pageDir = resolve(__dirname, 'src', 'pages')
const pageList = fs.readdirSync(pageDir)

const paheListHtml = pageList
	.map((pageName) => `<li><a href="./pages/${pageName}/index.html">${pageName}</a></li>`)
	.join('')

const htmlPlugin = () => {
	return {
		name: 'html-transform',
		transformIndexHtml(html) {
			return html.replace(/<ul id="root"><\/ul>/, `<ul id="root">${paheListHtml}</ul>`)
		},
	}
}

export default defineConfig({
	root: srcDir,
	build: {
		outDir: outDir,
		rollupOptions: {
			input: {
				main: resolve(srcDir, 'index.html'),
				// AuroraWaves: resolve(pageDir, 'aurora-waves', 'index.html'),
			},
		},
	},
	plugins: [htmlPlugin()],
})
