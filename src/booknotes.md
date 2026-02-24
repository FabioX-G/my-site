---
layout: layouts/base.njk
title: Book Notes
permalink: /booknotes/index.html
bodyClass: page-booknotes
---

# Book Notes

Selected notes and takeaways from books I found interesting to read at the time.

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
