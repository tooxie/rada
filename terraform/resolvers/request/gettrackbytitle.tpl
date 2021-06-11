{
  "version": "2017-02-28",
  "operation": "Query",
  "query": {
    "expression": "#id = :id and begins_with(#sk, :prefix) and #title = :title",
    "expressionNames": {
      "#id": "id",
      "#sk": "sk",
      "#title": "title"
    },
    "expressionValues": {
      ":id": $util.dynamodb.toDynamoDBJson($context.arguments.input.albumId),
      ":prefix": $util.dynamodb.toDynamoDBJson("track:"),
      ":title": $util.dynamodb.toDynamoDBJson($context.arguments.input.title)
    }
  }
}
