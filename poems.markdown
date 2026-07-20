---
layout: page
title: poems
permalink: /poems/
---

{% for poem in site.poems reversed %}
- [{{ poem.title | escape }}]({{ poem.url | relative_url }})
{%- endfor %}
