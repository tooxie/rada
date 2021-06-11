# Rada

A music player, but also a music platform...? I don't know, still figuring out
what this is. And what the final name will be.

## Installation

* Create the backend resources: [terraform/README.md](terraform/README.md)
* Index the music: [shiva/README.md](shiva/README.md)
* Run the client: [client/README.md](client/README.md)

## About

This system is optimized for a personal music collection:
* A reasonable amount of artists/albums
* Low cost (and dependent on usage)
* Simplicity

What is "a reasonable amount of artists/albums"? Any amount that a person could
hold in their music collection. Now if you plan on using this software to
compete with a popular music platform, it won't scale. Once the number of
artists goes from the hundreds (or even a few thousands) into the millions, the
system will become unusable slow due to certain database operations.

The cost will depend on the usage of the system. And the usage is the sum of:
* Storage
* Requests
* Transfer

From those variables the only fixed cost is storage, even if you don't use the
system, you will have a fixed cost from AWS just for holding your data. For the
size of a normal personal music collection requests and transfer will most
likely not transgress the limits of the free tier offered by Amazon. However,
check what those limits are in your region and remember that they can change at
any time.

Gawshi aims at being very simple to use, inspired by classic music players such
as Amarok. Its focus is mostly on artists and albums, rather than tracks, and
it won't provide many (if any) "social" capabilities (e.g. facebook or twitter
integration). It's for personal use.

Installation was made as simple as deploying a serverless app in the cloud can
be made. It's not a trivial task but it's as automated as possible. It boils
down to:
* Manually create a user that will be used to create another user with very
limited permissions (this is the only "manual" step)
* Creates the new, restricted user (from now on is all done from the cli)
* Create all gawshi resources and deploy the system (with the restricted user)
* Index your music
* Publish it

Indexing and publishing was intentionally split into 2 steps so you can mess
around with the data before publishing. This could mean fixing artist names,
removing some tracks (or even full albums) that you don't want uploaded, or
just checking out what will be published. This requires some SQL knowledge
though, because you will have to mess around with the sqlite database where we
store the data for publishing.

You can use [DB Browser](https://sqlitebrowser.org/) to inspect and fix the data
before publishing it.

## Values

* Simplicity: Work with very few concepts.
* Humbleness: Recognize your limitations.
* Excellence: Do few things but excel at them.
* Embrace the medium: Don't try to mimic a native experience on the web, make
  the most out of what you are given.
