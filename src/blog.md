---
layout: layouts/base.njk
title: 博客
---

# 博客文章

{% for post in collections.posts %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | dateFormat("yyyy-LL-dd") }})
{% endfor %}