---
layout: page
title: projects
permalink: /projects/
---

{% for project in site.projects reversed %}
- [ {{ project.date | date: "%Y-%m-%d" }} ] [{{ project.title | escape }}]({{ project.url | relative_url }})
{%- endfor %}
