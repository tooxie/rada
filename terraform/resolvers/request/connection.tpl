{
    "version": "2017-02-28",
    "operation": "Query",
    "index": "${index_name}",
    "query": {
        "expression": "#key = :value",
        "expressionNames": {
        "#key": "${index_key}"
    },
        "expressionValues": {
            ":value": $util.dynamodb.toDynamoDBJson($context.source.id)
        }
    }
}
