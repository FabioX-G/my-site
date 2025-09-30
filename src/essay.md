---
layout: layouts/base.njk
title: Essays
---

<h1>Essays</h1>
<ul>
{% for post in collections.essay %}
  {% if not post.data.draft %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a>
      <span>{{ post.date | date('yyyy-LL-dd') }}</span>
    </li>
  {% endif %}
{% endfor %}
</ul>