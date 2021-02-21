require "nokogiri"
require "open-uri"
require "byebug"

def parse_price(regex, text)
  match_data = regex.match(text)
  return 0 unless match_data
  match_data["price"].gsub(",", ".").to_f
end

products_to_search = ['arroz', 'feijao']
total_products = 0

products_to_search.each do |product_to_search|
  html = URI.open("https://lojaonline.minipreco.pt/search?q=#{product_to_search}%3Arelevance&show=All")
  doc = Nokogiri::HTML(html)

  doc.css("div.prod_grid").map do |product_div|
    next unless product_div.css('a.productMainLink').first
    product_url, product_name, _ = product_div.css('a.productMainLink').first.values
    product_price = parse_price(/(?:\d*,\d*)?\D*(?<price>\d*,\d*).*/, product_div.css("p.price").text.strip)
    product_price_per_kg = parse_price(/(?:\(\d*,\d*\)\D*)? \((?<price>\d*,\d*).*\)/, product_div.css("p.pricePerKilogram").text.strip)

    total_products += 1
    puts "Product: #{product_name} - #{product_price}, #{product_price_per_kg}"
  end
end
puts "Total products scraped: #{total_products}"
