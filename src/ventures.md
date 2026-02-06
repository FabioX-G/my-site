---
layout: layouts/base.njk
title: Ventures
---
<h1>Ventures</h1>
<ul>
{% for post in collections.venture %}
  {% if not post.data.draft %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a>
      <span>{{ post.date | date('yyyy-LL-dd') }}</span>
    </li>
  {% endif %}
{% endfor %}
</ul>
