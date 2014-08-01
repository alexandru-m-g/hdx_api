## Script for creating CPS-like tables for forg. ##
# It merges all those databases that use the dataset, indicator, value
# model into a single database. Finally, a single table is created
# by merging the dataset, indicator, and value tables. 
library(sqldf)

# loading tests
source('code/validate_import.R')  # for validating the import process
source('code/adding_url_to_fts_source.R')  # for fresh FTS data.
source('code/check_chd.R')  # for checking if the CHD is up-to-date
source('code/load_chd_list.R')  # for loading the latest CHD list

# Creating empty data.frames.
merged_dataset <- data.frame()
merged_indicator <- data.frame()
merged_value <- data.frame()

# Creating a source list.
# also add NYTimes when ready.
source_list <- c('fts', 'rw', 'sw', 'op', 'unhcr')

# Fetching and merging all data directly from the scrapers.
# collection date: July 12, 2014
message('loading data')
pb <- txtProgressBar(min = 0, max = length(source_list), style = 3, char = ".")
for (i in 1:length(source_list)) {
    setTxtProgressBar(pb, i)
    src <- source_list[i]
    message(paste('Loading', src))
    a  <- read.csv(paste0('source_data/', src, '-', 'dataset.csv'))
    b  <- read.csv(paste0('source_data/', src, '-', 'indicator.csv'))
    c  <- read.csv(paste0('source_data/', src, '-', 'value.csv'))  
    if (i == 1) { 
        zDataset <- a
        zIndicator <- b
        zValue <- c
    }
    else { 
        zDataset <- rbind(zDataset, a)
        zIndicator <- rbind(zIndicator, b)
        zValue <- rbind(zValue, c)
    }
}
message('done')

# Apparently the `value` table is coming with a lot of NAs
# from source. Hack: na.omit
# cleaning NAs
zValue <- na.omit(zValue)

# extremelly simple validation tests
# validating import -- read output
validateImport()

## Creating the tables
# a selection on the chd_list
chd_list_s <- data.frame(indID = chd_list$new_indID, name = chd_list$indicator_name)

# there is a larger problem of the lack of sync
# between the scrapers and indicator lists
# the indicator lists have been updated a couple of times
# those updates do not transate in the old scrapers. 
# fixes are urgently needed, especially in the SW-baseline
# scrapers.
zIndicator$indID <- NULL
zIndicator <- merge(zIndicator, chd_list_s, by = 'name')

# creating the denorm table
denorm_table <- merge(zValue, zIndicator, all = TRUE)
denorm_table <- merge(denorm_table, zDataset, all = TRUE)
denorm_table$indID <- NULL
denorm_table <- merge(denorm_table, chd_list_s, by = 'name')


## Running validation tests. 
# The duplicates validation test is failing now due to the 
# fact that one dummy indicator being the same as another.
source('code/validation_tests.R')
runValidation(df = zValue)


# Writing CSV files.
write.csv(zDataset, 'frog_data/csv/dataset.csv', row.names = F)
write.csv(zIndicator, 'frog_data/csv/indicator.csv', row.names = F)
write.csv(zValue, 'frog_data/csv/value.csv', row.names = F)
write.csv(denorm_table, 'frog_data/csv/denorm_table.csv', row.names = F)

# Storing data in a database.
db <- dbConnect(SQLite(), dbname="frog_data/db/cps_model_db.sqlite")
    message('storing: dataset')
    dbWriteTable(db, "dataset", zDataset, row.names = FALSE, overwrite = TRUE)
    message('storing: indicator')
    dbWriteTable(db, "indicator", zIndicator, row.names = FALSE, overwrite = TRUE)
    message('storing: value')
    dbWriteTable(db, "value", zValue, row.names = FALSE, overwrite = TRUE)
    
    # for testing
    # test <- dbReadTable(db, "value")
message('diconnecting')
dbDisconnect(db)

# Storing the denormalized table.
db <- dbConnect(SQLite(), dbname="frog_data/db/denormalized_db.sqlite")
    message('storing: dataset_denorm')
    dbWriteTable(db, "dataset_denorm", denorm_table, row.names = FALSE, overwrite = TRUE)
    # for testing
#     test <- dbReadTable(db, "dataset_denorm")
message('diconnecting')
dbDisconnect(db)