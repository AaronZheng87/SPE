rm(list = ls())#clear the environment
###############import the packages##############
library(tidyverse)
library(here)
source('4_Script/utils.R')

#set the path#
file_path <- here("5_Data")

files <- list.files(file_path, pattern = "csv", full.names = TRUE, recursive =T)
all <- purrr::map_dfr(.x = files, .f = ~jspsycsv2df(.x))

nrow(all)/3

aa = all |> filter(
  # subj_idx == 987654321,
  exp_condition == "Formal"
  )

aa$rt = as.numeric(aa$rt)/1000
aa$acc = aa$correct |> as.numeric()
aa$Matchness = factor(aa$Matchness)
aa$Valence = factor(aa$Valence)
aa$Valence = factor(aa$Valence, levels = c("自我", "朋友", "他人"))

# a1 = papaja::apa_barplot(
#   aa,
#   id = "subj_idx",
#   factors = c("Matchness", "Valence"),
#   dv = "rt"
# )
# a1$y
# a2 = papaja::apa_barplot(
#   aa,
#   id = "subj_idx",
#   factors = c("Matchness", "Valence"),
#   dv = "correct"
# )
# a2$y

fig_rt = aa |>
  ggplot(aes(Matchness, rt, fill = Valence)) +
  stat_summary(
    fun = "mean",
    geom = "bar",
    # col = "black",
    position = position_dodge(width = 1)) +
  # geom_bar(stat = "mean", position = position_dodge(width = 1)) +
  stat_summary(  #绘制误差线
    geom = "errorbar",
    fun.data = mean_se,
    # fill = "black",
    width = 0.3,
    show.legend = F,
    position = position_dodge(width = 1)) +
  # scale_fill_manual(values = c("white","gray")) +
  papaja::theme_apa(base_size = 16)
fig_acc = aa |>
  ggplot(aes(Matchness, acc, fill = Valence)) +
  stat_summary(
    fun = "mean",
    geom = "bar",
    # col = "black",
    position = position_dodge(width = 1)) +
  # geom_bar(stat = "mean", position = position_dodge(width = 1)) +
  stat_summary(  #绘制误差线
    geom = "errorbar",
    fun.data = mean_se,
    # fill = "black",
    width = 0.3,
    show.legend = F,
    position = position_dodge(width = 1)) +
  # scale_fill_manual(values = c("white","gray")) +
  papaja::theme_apa(base_size = 16)
library(patchwork)
(fig_rt / fig_acc) + plot_layout(guides = "collect")

library(lmerTest)
lmer(rt ~ Valence + (1|subj_idx), aa |> filter(Matchness == "Match")) |> anova()
bb = lmer(acc ~ Valence + (1|subj_idx), aa |> filter(Matchness == "Match"))
bb |> emmeans::emmeans(~Valence, type = "response")
