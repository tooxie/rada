#!/usr/bin/env python3
import os
import logging
import logging.config


def get_logger(name):
    log_conf = './logging.conf'
    dirname = os.path.dirname(__file__)
    logging.config.fileConfig(os.path.join(dirname, log_conf))
    level = os.environ.get('LOGLEVEL', 'INFO').upper()
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.debug("[LOGGER] Log level: " + logging.getLevelName(logger.level))

    return logger
