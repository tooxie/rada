#set( $albumId = "album:" + $util.autoId() )
#set( $artists = [] )
#set( $items = [] )
#set( $row = {} )
#set( $albumValue = {} )
#set( $artistValue = {} )

#foreach( $artistId in $context.arguments.input.artists )
  $util.qr( $artistValue.put("S", $artistId) )
  $util.qr( $row.put("id", $artistValue) )

  $util.qr( $albumValue.put("S", $albumId) )
  $util.qr( $row.put("sk", $albumValue) )

  $util.qr( $items.add($row) )
#end

{
  "version": "2017-02-28",
  "operation": "BatchPutItem",
  "tables": {
    "GawshiArtistsAlbums_7lwzlw": $util.toJson($items)
  }
}
