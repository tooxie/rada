{
  "version": "2017-02-28",
  "operation": "Scan",
  "filter": {
    "expression": "begins_with(id, :entity) and begins_with(sk, :entity)",
    "expressionValues": {
      ":entity": $util.dynamodb.toDynamoDBJson("${entity}:")
    }
  }
}
