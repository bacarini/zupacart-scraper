require "nokogiri"
require "open-uri"
require "byebug"

def parse_price(regex, text)
  match_data = regex.match(text)
  return 0 unless match_data
  match_data["price"].gsub(",", ".").to_f
end

products_to_search = ['arroz']
total_products = 0

def scrape(product_to_search, total_products, page=1)
  html = URI.open("https://www.continente.pt/stores/continente/pt-pt/public/Pages/searchResults.aspx?k=#{product_to_search}#/?page=#{page}")
  doc = Nokogiri::HTML(html)

  doc.css("div.productItem div.productBoxTop").map do |product_div|
    product_name = product_div.css("div.containerDescription div.title").text
    product_url = product_div.css("div.containerDescription div.title a").first.attribute("href").value
    product_brand = product_div.css("div.containerDescription div.type").text

    product_price = parse_price(/\D*(?<price>\d*,\d*).*/, product_div.css("div.containerPrice div.standardPriceContainer-selector div.priceFirstRow").text)
    product_price_per_kg = parse_price(/\D*(?<price>\d*,\d*).*/, product_div.css("div.containerPrice div.standardPriceContainer-selector div.priceSecondRow").text)

    total_products += 1
    puts "Product: #{product_name} Brand: #{product_brand} - #{product_price}, #{product_price_per_kg}"
  end

  scrape(product_to_search, total_products, page + 1) if doc.css("div.paginationArea div.next").first
end

products_to_search.each do |product_to_search|
  scrape(product_to_search, total_products)
end
puts "Total products scraped: #{total_products}"
