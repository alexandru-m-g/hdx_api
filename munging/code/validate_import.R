## validate import ##
validateImport <- function(sl = source_list) {
    pb <- txtProgressBar(min = 0, max = length(source_list), style = 3, char = ".")
    for (i in 1:length(source_list)) { 
        setTxtProgressBar(pb, i)
        src <- source_list[i]
        message(paste('Loading', src))
        a  <- read.csv(paste0('source_data/', src, '-', 'dataset.csv'))
        b  <- read.csv(paste0('source_data/', src, '-', 'indicator.csv'))
        c  <- read.csv(paste0('source_data/', src, '-', 'value.csv'))  
        
        if (i == 1) {
            count_dataset <- nrow(a)
            count_indicator <- nrow(b)
            count_value <- nrow(c)
        }
        else {
            count_dataset <- count_dataset + nrow(a)
            count_indicator <- count_indicator + nrow(b)
            count_value <- count_value + nrow(c)
        }
    }
    
    # message for dataset
    if (identical(nrow(zDataset), count_dataset)) message('Dataset: PASS.')
    else message('Dataset: FAIL!')
    message(paste('--> The count found', count_dataset, 
                  'records. The import contains', 
                  nrow(zDataset), 'records.'))
    
    # message for indicator
    if (identical(nrow(zIndicator), count_indicator)) message('Indicator: PASS.')
    else message('Indicator: FAIL!')
    message(paste('--> The count found', count_indicator, 
                  'records. The import contains', 
                  nrow(zIndicator), 'records.'))
    
    # message for value
    if (identical(nrow(zValue), count_value)) message('Value: PASS.')
    else message('Value: FAIL!')
    message(paste('--> The count found', count_value, 
                  'records. The import contains', 
                  nrow(zValue), 'records.'))
}