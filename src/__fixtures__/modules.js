import fs from 'fs'
import path from 'path'

export default fs
  .readFileSync(path.join(__dirname, 'modules.txt'), 'utf8')
  .trim()
