const Jsdoc2md = require('rskjs-jsdoc2md')
const path = require('path')
const fs = require('fs')

// const files = path.resolve(__dirname, '../src') + '/*.js'
const modulesPath = path.resolve(__dirname, '../src/modules')
const classPath = path.resolve(__dirname, '../src/classes')
const files = getFiles(classPath).concat(getFiles(modulesPath))
const parser = Jsdoc2md({ 'heading-depth': 3 })

mkReadme(files).then(console.log)


async function mkReadme (files) {
  try {
    let content = fs.readFileSync(path.resolve(__dirname, './HEAD.md'), 'utf-8')
    for (let file of files) {
      let { name, path } = file
      let txt = await parser.render(path)
      if (txt) content += `\n## ${name}\n${txt}`
    }
    return content
  } catch (err) {
    console.error(err)
  }
}

function titleFromFile (file) {
  let title = file.split('.')[0]
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return title
}

function getFiles (dir, ext = 'js') {
  return fs.readdirSync(dir).filter(f => f.endsWith(`.${ext}`)).map(f => {
    return { path: `${dir}/${f}`, name: titleFromFile(f) }
  })
}