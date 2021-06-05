#set( $uuid = "${entity}:" + $util.autoId() )

{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($uuid),
    "sk": $util.dynamodb.toDynamoDBJson($uuid),
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),
  "condition": {
    "expression": "attribute_not_exists(id) and attribute_not_exists(sk)",
  }
}
