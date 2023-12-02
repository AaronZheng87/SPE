rm(list = ls())#clear the environment
###############import the packages##############
library(tidyverse)
library(showtext)
library(here)
library(BayesFactor)
showtext.auto()
#set the path#
file_path <- here("5_Data", "exp1_osf_data")
#change working directory
bruceR::set.wd()
source('./utils.R')

files <- list.files(file_path, pattern = "csv", full.names = TRUE, recursive =T)
all <- purrr::map_dfr(.x = files, .f = ~jspsycsv2df(.x))

# all <- all %>% 
#   mutate_at(vars(word,valence), function(x){iconv(x, from = "GBK", to = "UTF-8")})
data <- all %>% #exclude practice
  dplyr::filter(exp_condition == "Formal")
##################################
# this is unnecessary for the true data!
# nrow(data)/3
# data[1:720,]$subj_idx <- '2'
# data[721:1440,]$subj_idx <- '3'
##################################
data2 <- data %>% 
  dplyr::filter(rt != "null")
data2$rt <- as.numeric(data2$rt)/1000
data2 = data2 |> mutate(
  target_identity = if_else(target == "Word", word, valence), # first stimulus
  test_identity = if_else(target == "Word", valence, word), # second stimulus
)
data2 = data2 |> mutate(ACC = as.numeric(correct))

df.agg1 <- data2 %>% 
  dplyr::group_by(subj_idx, target, valence, matchness) %>% 
  dplyr::summarise(rt_mean = mean(rt), 
                   sd = sd(rt)) %>% 
  dplyr::ungroup()

length(unique(df.agg1$valence))

df.agg1$subj_idx <- as.factor(df.agg1$subj_idx)

subjects1 <- sort(unique(df.agg1$subj_idx)) # sort by subjects' id

subjects1

stages <- c(seq(5, 10, by = 5)) # In the first stage we collected 20 subjects, and the second stage we collected 10 subjects

stage_n1 <- 0 # setting for count the loop times

bfdf1 <- data.frame(effect = NA, N = NA, BF = NA, stage = NA, upper_threshold = NA, lower_threshold = NA) # initial a dataframe to store results

for (i in stages) {
  # selected the data by subjects in each stage
  data1 <- subset(df.agg1, subj_idx %in% head(subjects1, i))
  
  stage_n1 <- stage_n1 + 1 # starting to add the loop times
  
  message(length(unique(data1$subj_idx)), " subjects")
  
  message("The data collection stage is ", stage_n1)
  
  data1$subj_idx <- as.factor(data1$subj_idx) # to factor
  
  BayesFactor::ttestBF()

  
  
}


df.agg1
data1 <- subset(df.agg1, subj_idx %in% head(subjects1, 5))
data1_match <- data1 %>% 
  dplyr::filter(matchness == "Match")
data1_self <- data1 %>% 
  dplyr::filter(valence == "自我")
data_self_word <- data1_self %>% 
  dplyr::filter(target == "Word")
data_self_Image <- data1_self %>% 
  dplyr::filter(target == "Image")

sum(data_self_word$matchness == data_self_Image$matchness)
word_image_m <- BayesFactor::ttestBF(x=data_self_word$rt_mean, y=data_self_Image$rt_mean, paired = TRUE)

word_image_output <- as.data.frame(word_image_m)[1,1]

data.frame(
  effect = "Match_self-Match_other", N = i,
  BF = self_other_output, stage = stage_n1,
  upper_threshold = 10, lower_threshold = 1 / 10
)

