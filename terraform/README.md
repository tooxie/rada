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

### Destroy (A.K.A. Running in CI pipelines)

To destroy all the created resources, run:

```
AWS_PROFILE=gawshi terraform destroy
```

If you have already uploaded files to S3 this will fail, you have to manually
delete all the files from the bucket and then run (again) the `destroy` command.

If you are running in an automated environment such as a CI/CD pipeline, then
you need to destroy all resources automatically without any human intervention.
For this to work, when creating the resources for the first time, tell gawshi
that the bucket and its contents can be safely deleted:

```
AWS_PROFILE=gawshi terraform apply -var="force_destroy_bucket=true"
```

Do not use this option in your personal project, you risk losing all your data
if you ever forget to run `apply` with the flag. It's not worth it.

Users
-----

If you need to recreate the root user simply taint the user's suffix:
```
AWS_PROFILE=gawshi terraform taint random_string.root_user_suffix
```

The previous command will reuse the same password. It's therefore highly 
recommended tainting the password as well:
```
AWS_PROFILE=gawshi terraform taint random_password.root_user_password
```

Note that those are 2 different resources, `random_string` and 
`random_password`.
