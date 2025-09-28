---
layout: layouts/base.njk
title: Blog
---

{% for post in collections.essay %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | dateFormat("yyyy-LL-dd") }})
{% endfor %}