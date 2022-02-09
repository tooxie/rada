Terraform
=========

Backend
-------

1. Create a user in IAM with programmatic access and the following policies:
  * AmazonS3FullAccess: To create the state bucket.
  * AmazonDynamoDBFullAccess: To create the locks DynamoDB table.
  * IAMFullAccess: To create the gawshi user.

You can also manually add the necessary permissions if you are not comfortable
with providing full access to any service.

2. Add your credentials to the `~/.aws/credentials` file:

```
[gawshi-backend-resources]
aws_access_key_id=<YOUR_AWS_ACCESS_KEY_ID>
aws_secret_access_key=<YOUR_AWS_SECRET_ACCESS_KEY>
```

3. Run terraform using the new profile from the `backend/` directory:
```
cd backend/
AWS_PROFILE=gawshi-backend-resources terraform init
AWS_PROFILE=gawshi-backend-resources terraform apply
```

You will be prompted for the region in which to create the resources.

4. Find the "gawshi-<suffix>" user in IAM and click on "Create access key".
5. Download the credentials and add them to the `~/.aws/credentials` file.

This guide will assume the name "gawshi" for the new profile.

Note: Both profiles must run under the same account for this to work.

Resources
---------

To create the application resources, from the `terraform/` directory, run:
```
AWS_PROFILE=gawshi terraform init -backend-config="bucket=<BUCKET_COPIED_FROM_OUTPUT>"
AWS_PROFILE=gawshi terraform apply
```

Get the AppSync API KEY:
```
AWS_PROFILE=gawshi terraform state pull | jq -r '.resources[] | select(.type == "aws_appsync_api_key") | .instances[0].attributes.key'
```

### Suffix

All resources will be suffixed with a random string to:
* Add an extra layer of caution to prevent clashing with existing resources.
* Enable for multiple instances of the system to run in the same account.

You can define your own suffix if you need to:

```
AWS_PROFILE=gawshi terraform apply -var="suffix=fffuuuuuu"
```
