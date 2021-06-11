#!/usr/bin/env python3
"""Shiva-server's music indexer repurposed for Gawshi.
Index your music collection for later publication to Gawshi.

Usage:
    indexer [-h] [-v] [-q] [--no-hash] [--reindex] [--write-every=<num>]
        [--verbose-sql]

Options:
    -h, --help           Show this help message and exit
    --no-hash            Do not hash files (used to identify and ignore
                         duplicates, but slows down indexing considerably).
    --reindex            Drop and recreate the database before indexing.
    --write-every=<num>  Write to disk and clear cache every <num> tracks
                         indexed.
    --verbose-sql        Print every SQL statement. Be careful, it's very
                         verbose.
    -v, --verbose        Show debugging messages about the progress.
    -q, --quiet          Suppress warnings.
"""
# K-Pg
import configparser
import multiprocessing
import threading
import os
import sys
import time

from new_persistence import get_db
# import indexer


def get_config():
    dirname = os.path.dirname(__file__)
    config_path = os.path.join(dirname, "./gawshi.conf")
    config = configparser.ConfigParser()
    config.read(config_path)

    return config


def walk(target):
    _target = os.path.expanduser(target)
    supported_formats = ('.mp3', '.flac', '.ogg')
    for root, _, files in os.walk(_target):
        for f in files:
            if f.endswith(supported_formats):
                yield os.path.join(root, f)


def index_worker(root, config):
    print(">>> index_worker")
    db = get_db(config)
    x = 0
    for path in walk(root):
        x += 1
        # indexer.index(path)

    print("Indexed: " + str(x))


def upload_worker():
    print(">>> upload_worker")
    time.sleep(3)
    print(">>> Uploader done.")


def count_files(root):
    x = 0
    for _ in walk(root):
        x += 1
    return x


if __name__ == '__main__':
    root = "~/Music/Gawshi"
    total = count_files(root)
    print("Total files:", total)
    config = get_config()
    # Process-based parallelism
    # indexer = multiprocessing.Process(target=index_worker, args=(root, config))
    # uploader = multiprocessing.Process(target=upload_worker)

    # Thread-based parallelism
    indexer = threading.Thread(
        name="Indexer",
        target=index_worker,
        args=(root, config),
    )
    uploader = threading.Thread(
        name="Uploader",
        target=upload_worker,
    )

    print("Starting threads...")
    indexer.start()
    print("Indexer started")
    uploader.start()
    print("Uploader started")

    uploader.join()
    print("Uploader finished")
    indexer.join()
    print("Indexer finished")
