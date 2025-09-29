---
layout: layouts/base.njk
title: Bookshelf
permalink: /library/index.html
bodyClass: page--tight-top
---

# Bookshelf

A living catalog of the physical books on my shelves. I read broadly and often jump between books from different subjects, whichever interests me the most at a particular moment.

- 🌟 My personal favorites are in highlighted 'orange' color. These books drastically changed the way I look at the world.
- 🟢 Books highlighted in 'green' color are strong recommendations that I think are really worth (re-)reading. 
- 🔵 Everything else I find super interesting are in the 'blue'.

Links go to Amazon; the year is the edition I own.

{% set list = library | sort(false, false, 'author') %}
<ul class="books">
{% for b in list %}
  {# Build Amazon link if needed #}
  {% set amz = b.amazon %}
  {% if not amz and b.asin %}
    {% set amz = "https://www.amazon.com/dp/" ~ b.asin %}
    {% if site.amazonTag %}{% set amz = amz ~ "?tag=" ~ site.amazonTag %}{% endif %}
  {% endif %}

  <li class="book{% if b.highlight %} {{ b.highlight }}{% endif %}">
    <strong>
      {% if amz %}<a href="{{ amz }}" target="_blank" rel="noopener noreferrer">{{ b.title }}</a>
      {% else %}{{ b.title }}{% endif %}
    </strong>
    — {{ b.author }}{% if b.year %}（{{ b.year }}）{% endif %}
    {% if b.highlight == "favorite" %} <span aria-label="favorite" title="Personal Favorite">🌟</span>{% endif %}
    {% if b.notes %}<br><small>{{ b.notes }}</small>{% endif %}
  </li>
{% endfor %}
</ul>