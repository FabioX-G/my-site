---
layout: layouts/base.njk
title: Blog
permalink: /blog/index.html
---

# Blog

New posts from 2025 onward are published directly on this personal website.

Posts from October 2022 to 2024 were originally published in English on Ghost/LinkedIn/Substack.

Posts from September 2022 and earlier were originally published in Chinese on WeChat.

<ul>
{% for post in collections.blog %}
  <li>
    <a href="{{ post.url }}">{{ post.data.title }}</a>
    <span>{{ post.date | date('yyyy-LL-dd') }}</span>
  </li>
{% endfor %}
</ul>
