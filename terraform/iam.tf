resource "aws_iam_role" "appsync" {
  name = "GawshiAppsync-${local.suffix}"

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

resource "aws_iam_role" "lambda_exec" {
  name = "GawshiLambda-${local.suffix}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow"
      },
    ]
  })
}

data "aws_iam_policy" "lambda_logging" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role = aws_iam_role.lambda_exec.name
  policy_arn = data.aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_policy" "lambda_s3_get_object" {
  name = "GawshiLambdaS3GetObject-${local.suffix}"
  path = "/"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:Get*",
          "s3:List*",
        ]
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.gawshi_music.arn,
          "${aws_s3_bucket.gawshi_music.arn}/*",
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_s3_get_object" {
  role = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_s3_get_object.arn
}

resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "GawshiLambdaWriteDynamodb-${local.suffix}"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "dynamodb:*",
        ],
        Effect = "Allow",
        Resource = [
             aws_dynamodb_table.artists_albums.arn,
          "${aws_dynamodb_table.artists_albums.arn}/*",

             aws_dynamodb_table.tracks.arn,
          "${aws_dynamodb_table.tracks.arn}/*",

             aws_dynamodb_table.invitations.arn,
          "${aws_dynamodb_table.invitations.arn}/*",

             aws_dynamodb_table.servers.arn,
          "${aws_dynamodb_table.servers.arn}/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "appsync_dynamodb" {
  name = "Gawshi-AppsyncDynamodb-${local.suffix}"
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
             aws_dynamodb_table.artists_albums.arn,
          "${aws_dynamodb_table.artists_albums.arn}/*",

             aws_dynamodb_table.tracks.arn,
          "${aws_dynamodb_table.tracks.arn}/*",

             aws_dynamodb_table.invitations.arn,
          "${aws_dynamodb_table.invitations.arn}/*",

             aws_dynamodb_table.servers.arn,
          "${aws_dynamodb_table.servers.arn}/*",
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

resource "aws_iam_role" "cloudwatch" {
  name = "GawshiApiGatewayCloudwatchGlobal-${local.suffix}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "apigateway.amazonaws.com"
        },
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "GawshiApiGatewayCloudwatchGlobal-${local.suffix}"
  role = aws_iam_role.cloudwatch.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents"
        ],
        Effect = "Allow",
        Resource = "*"
      }
    ]
  })
}
