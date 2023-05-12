resource "aws_dynamodb_table" "artists_albums" {
  name = "GawshiArtistsAlbums-${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "adjacentId"
  range_key = "id"

  attribute {
    name = "adjacentId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "slug"
    type = "S"
  }

  local_secondary_index {
    name = "ByName"
    range_key = "slug"
    projection_type = "ALL"
  }

  global_secondary_index {
    name = "ById"
    hash_key = "id"
    range_key = "adjacentId"
    projection_type = "KEYS_ONLY"
  }
}

resource "aws_dynamodb_table" "tracks" {
  name = "GawshiTracks-${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "albumId"
  range_key = "id"

  attribute {
    name = "albumId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "ordinal"
    type = "N"
  }

  local_secondary_index {
    name = "ByOrdinal"
    range_key = "ordinal"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "invitations" {
  name = "GawshiInvitations-${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "server_invitations" {
  name = "GawshiServerInvitations-${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "servers" {
  name = "GawshiServers-${local.suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
