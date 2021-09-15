const fs = require('fs')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const enums = {}

fs.readdir('./files', { encoding: 'utf8' }, (err, files) => {
  files.forEach(fileName => {
    if (fileName.includes('.html')) {
      fs.readFile(`./files/${fileName}`, { encoding: 'utf8' }, (err, file) => {
        const dom = new JSDOM(file.toString())
        const selectList = dom.window.document.querySelectorAll('select')
        selectList.forEach(item => {
          const name = `#u${Number(item.parentElement.id.substr(1)) - 1} span`
          const title = dom.window.document.title
          let key = dom.window.document.querySelector(name)?.textContent || name
          // key 存在
          if (enums.hasOwnProperty(key)) {
            key = key + title
          }
          enums[key] = []
          Array.from(item.children).forEach((n, i) => {
            enums[key].push({
              label: n.textContent,
              value: i
            })
          })
        })

        fs.writeFile('./output/enums.json', JSON.stringify(enums), { encoding: 'utf8' }, () => {
          console.log('写入成功')
        })
      })
    }
  })
})
