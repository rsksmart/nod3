import path from 'path'
import fs from 'fs'
const p = path.resolve(__dirname)

export const getExample = (methodName, params) => {
  try {
    const [module, method] = methodName.split('_')
    let example = fs.readFileSync(`${p}/${module}/${method}/01.json`).toString()
    example = JSON.parse(example)
    let { result } = example
    return result
  } catch (err) {
    console.error(err)
    process.exit(9)
  }
}
