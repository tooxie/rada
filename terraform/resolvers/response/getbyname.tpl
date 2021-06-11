## If the result is not a list (we assume null) or an empty list, then just
## return an empty object. If it's a list, then return the first item only if
## the query returned 1 item. If we have more than 1 then raise an error.

#if( $util.isList($context.result.items) )
  #if( $context.result.items.size() == 0 )
    null
  #elseif( $context.result.items.size() == 1 )
    #return($context.result.items[0])
  #elseif( $context.result.items.size() > 1 )
    $util.error("Too many matches: $context.result.items.size()")
  #end
#else
  null
#end
