library(osfr)

bruceR::set.wd()

osf_auth(token = "TXxp7mH2M2JFPC0kWoxhAtuYNmcpHaf2oy3q3rNJERvYbE7cIT5wWsLZfJP1wxA1JSI7qp")

# exp1 
osf_retrieve_node("dfguq") %>%
  osf_ls_files() %>%
  osf_download(
    path = "../5_Data/exp1_osf_data", 
    # recurse = T,
    verbose = T, progress = T,
    conflicts = "skip")


# exp2

