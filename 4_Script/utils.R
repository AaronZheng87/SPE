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
                          dist, trial_type, image, word, target, #test, 
                          valence, matchness, #image_start, word_start,
                          exp_condition, response, key_press, correct_response, 
                          correct, rt)
  
  df3 <- df2 %>% 
    dplyr::filter(trial_type == "psychophysics")
  
  return(df3)
  
}


lifetable = function(df, rt_min = 250, rt_max = 1600, bin_seq = 50){
  
  library(data.table)
  cut_bins = seq(rt_min, rt_max, bin_seq)
  n_bins = length(cut_bins) -1
  
  df = df |> data.table::data.table()
  RS = nrow(df)
  n_total = RS
  
  res = data.table::data.table()
  for(i in 1:n_bins ) {
    
    lower_boundary = cut_bins[i]
    upper_boundary = cut_bins[i + 1]
    
    tmp_df = data.table::data.table()
    tmp_df$label = paste0("(", lower_boundary, ",", upper_boundary, "]")
    tmp_df$bin_ind = i
    
    df_subset = subset(df, rt > lower_boundary / 1000 &
                         rt < upper_boundary / 1000)
    
    
    tmp_df[, "E"] = nrow(df_subset)
    tmp_df[, "rt"] = mean(df_subset[["rt"]])
    tmp_df[, "ACC"] = mean(df_subset[["ACC"]])
    
    if (i == 1) {
      tmp_df$RS = RS
      res = rbind(res, tmp_df)
    } else{
      tmp_df$RS = res[i - 1, "RS"] - res[i - 1, "E"]
      res = rbind(res, tmp_df)
    }
    
  }
  res = res |> mutate(
    hf = E/RS,           # hazard function
    caf = ACC,           # accuracy conditional function
    pdf = E/n_total,
    sf = pdf/hf,         # survival function
    cdf = 1-sf
  )
  res[is.na(res), ] <- 0
  
  res
}

lifetable_group_by <- function(df, ...) {
  df %>%
    group_by(...) %>%
    do({
      lifetable = lifetable(.)
      lifetable = data.table(lifetable)
      lifetable
    }) |> bind_rows()
}


plot_EHA <- function(df, dv = "hf", title = "") {
  df |> 
    filter(subj_idx %in% c(5,13,18)) |> 
    mutate_at(.vars = "subj_idx", factor) |> 
    ggplot(aes(x = bin_ind, col=matchness)) +
    geom_line(aes(y=!!sym(dv))) + 
    facet_wrap(~subj_idx) + 
    labs(title = title, x = "")
}
