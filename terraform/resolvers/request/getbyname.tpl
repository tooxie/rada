{
  "version": "2017-02-28",
  "operation": "Scan",
  "filter": {
    "expression": "begins_with(id, :entity) and begins_with(sk, :entity) and #name = :name",
    "expressionNames": {
      "#name": "name"
    },
    "expressionValues": {
      ":entity": $util.dynamodb.toDynamoDBJson("${entity}:"),
      ":name": $util.dynamodb.toDynamoDBJson($context.arguments.input.name)
    }
  }
}
