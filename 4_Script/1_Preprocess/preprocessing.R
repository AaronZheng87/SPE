rm(list = ls())#clear the environment
###############import the packages##############
library(tidyverse)
library(here)
source('4_Script/utils.R')

#set the path#
file_path <- here("5_Data", "0_testdata")

files <- list.files(file_path, pattern = "csv", full.names = TRUE)
all <- purrr::map_dfr(.x = files, .f = ~preprocessing(.x))

nrow(all)/3
