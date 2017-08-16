# Jacob Fischer's Resume

This is a simple project to build the file(s) for my resume.

It's basically a static html page with some styles describing some stuff I can do. This is built once from some bash scripts, and then produces all the files needed for my resume site to function.

## Build

If you are trying to build so you can have my resume, don't! GitHub pages are super cool so I use that to deploy them all to [resume.jacobfischer.me](http://resume.jacobfischer.me/). Just go there. Otherwise if you are looking to use my tool to create your own resume building thing read on!

### Requirements

This is only intended to build on Linux. It could be adapted to work on Windows, but I only need it to work on Linux so that's all this will cover.

In addition you'll need Node.js, npm, bash, and Qt installed.


### Build

To build, just run:

```bash
./setup.sh
./build.sh
```

That's it. Now the site can be served from the root (`index.html`) and it all should be good.

If you are modifying the resume's content (`index.html`) or styles (`styles/`), then you can just re-run `build.sh` to re-build the files. The `setup.sh` script just set's up the required binaries needed to build with.

## Other Notes

My resume, as I give it to some companies, may vary from what is present here. I often remove skills I don't think that company would care about, and emphasize others. That's really the point of this build system, to automate my updates of my resume while still being slick.
