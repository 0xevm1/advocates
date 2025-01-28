## Features

I started with low hanging fruit about the project, such as environment variable issues, build issues, and then built on top of it to address performance issues, type issues, specifically around the Advocate object. Then to ensuring database usage was the primary datasource, then visual tweaks and UI/UX performance optimizations

These can be seen in the Pull Requests


## Tradeoffs

If there was more time, pagination would have been implemented on the frontend, backend and ORM side, the virtualization and memoizing of the table handles the performance aspect for some time, as only some rows are implemented. This is good for the MVP and the dummy data, and will scale to several thousand of entries. Receiving and parsing the larger json response will become the bottleneck first.

Additionally caching of the database queries responses would have been implemented

After changing the Table UI in Pull Request EN-9, the responsive view was altered and I would have fixed that