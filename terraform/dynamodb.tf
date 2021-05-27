resource "aws_dynamodb_table" "albums" {
  name = "GawshiAlbums"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "artistId"
    type = "S"
  }

  global_secondary_index {
    name = "ArtistIdIndex"
    hash_key = "artistId"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "artists" {
  name = "GawshiArtists"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "playlists" {
  name = "GawshiPlaylists"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "tracks" {
  name = "GawshiTracks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "albumId"
    type = "S"
  }

  global_secondary_index {
    name = "AlbumIdIndex"
    hash_key = "albumId"
    projection_type = "ALL"
  }
}
