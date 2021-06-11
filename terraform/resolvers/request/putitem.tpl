{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "id": "${entity}:$util.dynamodb.toDynamoDBJson($util.autoId())",
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($context.arguments.input),
  "condition": {
    "expression": "attribute_not_exists(#id)",
    "expressionNames": {
      "#id": "id",
    }
  }
}
