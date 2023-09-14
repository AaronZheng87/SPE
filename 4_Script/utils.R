jspsycsv2df <- function(path){
  #import the data from path
  df <- read_csv(path)
  # basic information of subject
  df$subj_idx <- jsonlite::fromJSON(df$response[5])$Q0
  df$gender <- jsonlite::fromJSON(df$response[6])
  df$year <- jsonlite::fromJSON(df$response[7])$Q0 
  df$education <- jsonlite::fromJSON(df$response[8])$Q0
  df$dist <- df$view_dist_mm[9]
  head(df)
  
  df2 <- df %>% 
    dplyr::select(subj_idx, gender, year, education, 
                  dist, trial_type, Image, word, target, test, 
                  image_start, word_start, Valence, Matchness, 
                  exp_condition, response, key_press, correct_response, 
                  correct, rt)
  
  df3 <- df2 %>% 
    dplyr::filter(trial_type == "psychophysics")
  
  return(df3)
  
}