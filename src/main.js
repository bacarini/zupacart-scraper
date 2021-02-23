const scrape = require('./spiders/continente')

const producsToSearch = [
  'arroz',
  'feijao'
]

producsToSearch.forEach(producToSearch => {
  scrape(producToSearch)
})
