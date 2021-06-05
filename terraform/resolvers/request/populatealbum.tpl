{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.prev.result.albumId),
    "sk": $util.dynamodb.toDynamoDBJson($ctx.prev.result.albumId),
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($util.map.copyAndRemoveAllKeys($ctx.args.input, ["artists"]))
}
