#if($context.prev.result.isEmpty())
  #return
#end

#set( $keys = [] )

#foreach( $row in $context.prev.result )
  #set( $id = {} )
  #set( $item = {} )

  $util.qr( $id.put("S", $row.sk) )
  $util.qr( $item.put("id", $id) )
  $util.qr( $item.put("sk", $id) )

  $util.qr( $keys.add($item) )
#end

{
  "version": "2018-05-29",
  "operation": "BatchGetItem",
  "tables": {
    "${table_name}": {
      "keys": $util.toJson($keys)
    }
  }
}
