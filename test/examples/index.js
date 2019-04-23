import path from 'path'
import fs from 'fs'
const basePath = path.resolve(__dirname)

export const getExamples = (methodName, params) => {
  try {
    const [module, method] = methodName.split('_')
    if (!module || !method) throw new Error(`invalid methodName ${methodName}`)
    const examplePath = `${basePath}/${module}/${method}`
    const examples = fs.readdirSync(`${examplePath}`)
    const total = (Array.isArray(examples)) ? examples.length : undefined
    if (!total) throw new Error(`the example folder: ${examplePath} is empty`)
    let key = 0
    const next = () => {
      if (!examples[key]) return
      const file = `${examplePath}/${examples[key]}`
      key++
      let example = fs.readFileSync(file).toString()
      example = JSON.parse(example)
      let { result } = example
      return result
    }

    return Object.freeze({ next, total })
  } catch (err) {
    console.error(err)
    process.exit(9)
  }
}
