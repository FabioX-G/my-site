---
layout: layouts/base.njk
title: Blog
---

<h1>Blog</h1>
<ul>
{% for post in collections.essay | reverse %}
  {% if not post.data.draft %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a>
      <span>{{ post.date | date('yyyy-LL-dd') }}</span>
    </li>
  {% endif %}
{% endfor %}
</ul>