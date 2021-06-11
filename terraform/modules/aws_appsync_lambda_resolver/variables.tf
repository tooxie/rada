variable "appsync_graphql_api_id" {
  description = "The ID of the GraphQL (AppSync) API"
  type = string
}

variable "appsync_graphql_api_arn" {
  description = "The ID of the GraphQL (AppSync) API"
  type = string
}

variable "type" {
  description = ""
  type = string
}

variable "field" {
  description = ""
  type = string
}

variable "source_file" {
  description = ""
  type = string
}

variable "output_path" {
  description = ""
  type = string
}

variable "function_name" {
  description = ""
  type = string
}

variable "lambda_role_arn" {
  description = ""
  type = string
}

variable "lambda_handler" {
  description = ""
  type = string
}

variable "environment" {
  description = ""
  type = map
}

# variable "datasource_name" {
#   description = ""
#   type = string
# }

variable "datasource_service_role_arn" {
  description = ""
  type = string
}
