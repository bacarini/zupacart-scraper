const scrape = require('./spiders/continente')
const db = require('./db')

var productsToSearch = process.argv.slice(2);
const main = async (productsToSearch) => {
  await Promise.all(
    productsToSearch.map(async (productToSearch) => {
      console.log(`Start looking for ${productToSearch}`)
      const data = await scrape(productToSearch)

      data.forEach((item) => {
        const values = [item.productName, item.productURL, item.productBrand, item.productPrice, item.productPricePerKg];
        db.query('INSERT INTO products(name, url, brand, price, price_per_kilo) VALUES($1, $2, $3, $4, $5) RETURNING *', values)
          .catch(e => console.error(e.stack))
      });
    })
  )
}

main(productsToSearch);
