#!/usr/bin/env python3
from sqlalchemy import func, create_engine
from sqlalchemy.orm import Session

import models as m


def get_db_url(config):
    return config.get('gawshi', 'db_url')


def get_sqlalchemy_echo(config):
    return config.getboolean('gawshi', 'sqlalchemy_echo', fallback=False)


def get_db(config):
    db_url = get_db_url(config)
    db_echo = get_sqlalchemy_echo(config)
    print(db_url, db_echo)
    engine = create_engine(db_url, echo=db_echo)
    session = Session(engine)
    m.Base.metadata.create_all(engine)

    return session.query
