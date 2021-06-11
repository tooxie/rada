Infrastructure
==============

Why AWS?
--------


Why Python?
-----------


Monorepo
--------

We have everything in one repo because that simplifies automation. We know
where the client is, so we can automatically generate the config file for it
without requiring the user to clone it manually and provide us with the path.
Eventually, if someone ever wants to write a client of their own, we could add
the option to use a different client instead, but until then there's no reason
to add that extra complexity.
