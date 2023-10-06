library(tidyverse)
df <- read_csv("/Users/zhengyuanrui/SPE/5_Data/3_test_yuanrui3/exp11 (7).csv")
df$subj_idx <- jsonlite::fromJSON(df$response[5])$Q0
df$gender <- jsonlite::fromJSON(df$response[6])
df$year <- jsonlite::fromJSON(df$response[7])$Q0 
df$education <- jsonlite::fromJSON(df$response[8])$Q0
df$dist <- df$view_dist_mm[9]

df2 <- df %>% 
  dplyr::select(subj_idx, gender, year, education, 
                dist, trial_type, image, word, target, #test, 
                valence, matchness, #image_start, word_start,
                exp_condition, response, key_press, correct_response, 
                correct, rt) %>% 
  filter(trial_type == "psychophysics")

df2 %>% 
  group_by(exp_condition) %>% 
  summarise(n = n())
