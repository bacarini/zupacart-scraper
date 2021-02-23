const scrape = require('./spiders/continente')

const producsToSearch = [
  'arroz',
  'feijao'
]

await Promise.all(
  productsToSearch.map(async (productToSearch) => {
    console.log(`Start looking for ${productToSearch}`)
    await scrape(producToSearch)
  })
)
