---
layout: layouts/base.njk
title: 博客文章
---

{% for post in collections.blogDesc %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | dateFormat("yyyy-LL-dd") }})
{% endfor %}