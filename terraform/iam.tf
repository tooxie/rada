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
          "${aws_dynamodb_table.albums.arn}",
          "${aws_dynamodb_table.albums.arn}/*",

          "${aws_dynamodb_table.artists.arn}",
          "${aws_dynamodb_table.artists.arn}/*",

          "${aws_dynamodb_table.playlists.arn}",
          "${aws_dynamodb_table.playlists.arn}/*",

          "${aws_dynamodb_table.tracks.arn}",
          "${aws_dynamodb_table.tracks.arn}/*",
        ]
      }
    ]
  })
}

data "aws_iam_policy" "appsync_push_to_cloudwatch" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs"
}

resource "aws_iam_role_policy_attachment" "appsync_push_to_cloudwatch" {
  role = aws_iam_role.appsync.name
  policy_arn = data.aws_iam_policy.appsync_push_to_cloudwatch.arn
}
