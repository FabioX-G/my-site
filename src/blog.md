---
layout: layouts/base.njk
title: Blog
---

{% for post in collections.blogDesc %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | dateFormat("yyyy-LL-dd") }})
{% endfor %}