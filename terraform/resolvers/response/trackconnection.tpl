#if( !$util.isList($context.result.items) )
  #return($util.toJson([]))
#end

#set( $tracks = [] )
#foreach($item in $context.result.items)
  #set( $track = $util.map.copyAndRemoveAllKeys($item, ["id", "sk"]) )
  $util.qr( $track.put("id", $item.sk) )
  $util.qr( $tracks.add($track) )
#end

$util.toJson($tracks)
