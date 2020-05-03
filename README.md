# face-mask-yt-analysis

A quick and dirty script used to get some metrics on diy face mask videos on YouTube.

Originally I did a "search" by manually going to youtube, searching "DIY Face Mask", scrolling until the end and downloading the resulting HTML.

Afterwards I found out about the Youtube API, which can be used exclusively to do the whole thing.

Youtube API is free, but there is a default quota of 10,000 "units", which limits the number of requests you can make. Read more about it here:

https://developers.google.com/youtube/v3

It is interesting to see how bad the "Filter Bubble" effect is with Youtube search. It does not index all the videos.
