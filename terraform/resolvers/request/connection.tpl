{
  "version": "2017-02-28",
  "operation": "Query",
  "query": {
    "expression": "#id = :id and begins_with(#sk, :prefix)",
    "expressionNames": {
      "#id": "id",
      "#sk": "sk"
    },
    "expressionValues": {
      ":id": $util.dynamodb.toDynamoDBJson($context.source.id),
      ":prefix": $util.dynamodb.toDynamoDBJson("${entity}:")
    }
  }
}
