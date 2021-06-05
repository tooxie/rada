#set( $data = {
  "albumId": $context.result.data.${table_name}[0].sk
} )
$util.toJson($data)
