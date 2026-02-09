---
layout: layouts/base.njk
title: Book Notes
permalink: /booknotes/index.html
---

# Book Notes

Reading notes and takeaways from books I have finished.

<ul>
{% for post in collections.booknotes %}
  {% if not post.data.draft %}
    <li>
      <a href="{{ post.url }}">{{ post.data.booknotesTitle or post.data.title }}</a>
      <span>{{ post.date | date('yyyy-LL-dd') }}</span>
    </li>
  {% endif %}
{% endfor %}
</ul>
