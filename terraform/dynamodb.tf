resource "aws_dynamodb_table" "artists_albums" {
  name = "GawshiArtistsAlbums_${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"
  range_key = "sk"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "year"
    type = "N"
  }

  local_secondary_index {
    name = "ByYear"
    range_key = "year"
    projection_type = "INCLUDE"
    non_key_attributes = [
      "name"
    ]
  }
}

resource "aws_dynamodb_table" "playlists" {
  name = "GawshiPlaylists_${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "addedAt"
    type = "S"
  }

  global_secondary_index {
    name = "AddedAtIndex"
    hash_key = "addedAt"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "tracks" {
  name = "GawshiTracks_${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"
  range_key = "sk"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }
}

resource "aws_dynamodb_table" "favourites" {
  name = "GawshiFavs_${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "trackId"

  attribute {
    name = "trackId"
    type = "S"
  }
}
