resource "aws_iam_role" "appsync" {
  name = "GawshiAppsync"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "appsync.amazonaws.com"
        },
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy" "gawshi_dynamodb" {
  name = "GawshiDynamodb"
  role = aws_iam_role.appsync.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "dynamodb:*",
        ],
        Effect = "Allow",
        Resource = [
          aws_dynamodb_table.albums.arn,
          aws_dynamodb_table.artists.arn,
          aws_dynamodb_table.playlists.arn,
          aws_dynamodb_table.tracks.arn,
        ]
      }
    ]
  })
}
