---
layout: layouts/base.njk
title: Bookshelf
permalink: /library/index.html
bodyClass: page--tight-top
---

# Bookshelf
Below are some of the physical books that I own on my bookshelf. 

I highlight my "personal favorite" books in orange, and the ones that I think are "really worth reading" in green. Most books are in standard blue, but they were all once or still interesting to me when I bought them. Some books I only looked at the first few chapters and started exploring other books. 

🌟 = Personal Favorite

{% set list = library | sort(false, false, 'author') %}
<ul class="books">
{% for b in list %}
  {% set amz = b.amazon %}
  {% if not amz %}
    {% set amz = "https://www.amazon.com/dp/" ~ b.asin %}
    {% if site.amazonTag %}
      {% set amz = amz ~ "?tag=" ~ site.amazonTag %}
    {% endif %}
  {% endif %}
  <li class="book{% if b.highlight %} {{ b.highlight }}{% endif %}">
    <strong><a href="{{ amz }}" target="_blank" rel="noopener">{{ b.title }}</a></strong>
    — {{ b.author }}{% if b.year %}（{{ b.year }}）{% endif %}
    {% if b.highlight == "favorite" %} <span aria-label="favorite" title="强烈推荐">🌟</span>{% endif %}
    {% if b.notes %}<br><small>{{ b.notes }}</small>{% endif %}
  </li>
{% endfor %}
</ul>