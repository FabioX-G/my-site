---
layout: layouts/base.njk
title: Essays
permalink: /essays/index.html
---
“An essay is something you write to figure something out.” - [Paul Graham](https://www.paulgraham.com/field.html)

Every essay here is an attempt to figure something out for myself.

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
