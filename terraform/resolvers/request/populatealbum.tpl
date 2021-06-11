{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($context.prev.result.id),
    "sk": $util.dynamodb.toDynamoDBJson($context.prev.result.id),
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($util.map.copyAndRemoveAllKeys($context.arguments.input, ["artists"]))
}
