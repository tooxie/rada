Shiva
=====

This is a stripped-down fork of [Shiva](https://github.com/tooxie/shiva-server),
without the (flask) http layer.

## Installation

* Create virtual environtment: `python -m venv .venv`
* Activate it: `source .venv/bin/activate`
* Install dependencies: `pip install --upgrade pip -r dependencies.pip`

In a one-liner:
```
python -m venv .venv && \
source .venv/bin/activate && \
pip install --upgrade pip -r dependencies.pip
```

### Configuring the indexer

* Open the file `shiva/gawshi.conf` with your favourite editor.
* Find the option `music_dir` and point it to your music collection.
* Go to https://www.discogs.com/settings/developers and copy your personal access token.
* Find the option `discogs_token` and paste it there.
* Run the indexer: `python shiva/indexer.py`
* Process (upload) the files: `AWS_PROFILE=gawshi python shiva/process.py`

## TODO

* Use [Rekognition](https://aws.amazon.com/de/rekognition/) to find the center of
  the artist's image, so that we can position it properly in the header.
