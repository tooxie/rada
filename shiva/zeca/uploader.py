#!/usr/bin/env python3
import logging
import logging.config
import os
import time

import boto3
import botocore

MAX_RETRIES = 5


def get_logger():
    return logging.getLogger(__name__)
    log_conf = '../logging.conf'
    dirname = os.path.dirname(__file__)
    logging.config.fileConfig(os.path.join(dirname, log_conf))

    return logging.getLogger('process')


def object_exists(bucket, key, retry=0):
    logger = get_logger()

    if retry >= MAX_RETRIES:
        logger.error('Max retries exceeded, aborting')
        raise Exception('Max retries exceeded')

    s3 = boto3.resource('s3')
    try:
        s3.Object(bucket, key).load()
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            return False
        else:
            raise e
    except Exception as e:
        logger.error('Error connecting to bucket "%s"' % bucket)
        logger.error(e)
        logger.info('Retrying...')
        return object_exists(bucket, key, retry + 1)

    return True


def get_s3_client():
    logging.getLogger('boto3').setLevel(logging.ERROR)
    logging.getLogger('botocore').setLevel(logging.ERROR)
    logging.getLogger('s3transfer').setLevel(logging.ERROR)

    return boto3.client('s3')


def upload(track, bucket_name, bucket_url, retry=0):
    if track.url:
        return

    logger = get_logger()

    if retry >= MAX_RETRIES:
        logger.error('Max retries exceeded, aborting')
        raise Exception('Max retries exceeded')

    s3 = get_s3_client()
    object_key = ".".join((track.hash, track.path.split(".")[-1]))
    if not object_exists(bucket_name, object_key):
        logger.debug("Uploading track %s -> s3://%s/%s" % (
            f"'{track.title}'" if track.title else "<NO NAME>",
            bucket_name,
            object_key,
        ))
        try:
            s3.upload_file(track.path, bucket_name, object_key)
        except Exception as e:
            logger.error('Error uploading %s' % track.path)
            logger.error(e)
            logger.info('Retrying...')
            return upload(track, bucket_name, bucket_url, retry + 1)
    else:
        logger.info("Track '%s' exists in bucket" % track.title)

    # logger.info('[UPLOAD] (123bytes in 2s) %s' % (track.path))
    return '%s/%s' % (bucket_url.strip('/'), object_key)
