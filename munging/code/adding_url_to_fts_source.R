## Adding URL to FTS data. 
# FTS data comes from the scraper without proper source. 
fts_data <- read.csv('source_data/fts-value.csv')
fts_data$source <- 'http://fts.unocha.org/api/Files/APIUserdocumentation.htm'
write.csv(fts_data, 'source_data/fts-value.csv', row.names = F) 