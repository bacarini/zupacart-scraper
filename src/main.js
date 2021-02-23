const scrape = require('./spiders/continente')

const producsToSearch = [
  'arroz',
  'feijao'
]

producsToSearch.forEach(producToSearch => {
  console.log(`Start looking for ${producToSearch}`)
  scrape(producToSearch)
})
