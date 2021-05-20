Terraform
=========

Backend
-------

1. Create a user in IAM with programmatic access and the following policies:
  * AmazonS3FullAccess
  * AmazonDynamoDBFullAccess

2. Add your credentials to the `~/.aws/credentials` file:

```
[gawshi-backend-resources]
aws_access_key_id=<YOUR_AWS_ACCESS_KEY_ID>
aws_secret_access_key=<YOUR_AWS_SECRET_ACCESS_KEY>
```

3. Run terraform using the new profile:
```
cd backend/
AWS_PROFILE=gawshi-backend-resources terraform init
AWS_PROFILE=gawshi-backend-resources terraform plan
```

You will be prompted for the region in which to create the resources.

4. Delete the new user.

Resources
---------

To be continued...
