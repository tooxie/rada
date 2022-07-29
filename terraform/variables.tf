variable "region" {
  type = string
}

variable "suffix" {
  type = string
  default = ""
}

variable "website_root" {
  type = string
  default = "../client/build"
}

variable "force_destroy_bucket" {
  type = bool
  default = false
}

variable "server_name" {
  type = string
  default = "rada.fan"
}
