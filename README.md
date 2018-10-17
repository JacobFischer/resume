# Jacob Fischer's Resume

This is a simple project to build the file(s) for my resume.

It's easiest to manage my resume via a simple markdown file. This project leverages my web skills to build the simple
markdown text into full fledged html + pdf sources for me to distribute.

## Build

If you are trying to build so you can have my resume, don't! GitHub pages are super cool so I use that to deploy them
all to [resume.jacobfischer.me](http://resume.jacobfischer.me/). Just go there. Otherwise if you are looking to use my
tool to create your own resume building thing read on!

### Requirements

Only Node.js with npm is required.

### Build

To build, just run:

```bash
npm install
npm run build
```

That's it. All the output is ready for you in `output/`.

## Other Notes

My resume, as I give it to some companies, may vary from what is present here. I often remove skills that I don't
think a company would care about, and emphasize others. That's really the point of this build system, to automate my
updates of my resume while still being slick.
