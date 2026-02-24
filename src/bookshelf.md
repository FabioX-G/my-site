---
layout: layouts/base.njk
title: Bookshelf
permalink: /bookshelf/index.html
bodyClass: page--tight-top bookshelf-page
---

# Bookshelf

This is a record of books I've read and kept around.

For years, schools tricked us into viewing reading like mandatory chores (aka homework). That changed when I started choosing books based on my personal curiosity at any given time, not obligation enforced by someone else.

Most books here are physical copies from my bookshelf at home, and the list keeps growing as my interests expand over time.

To help you navigate, I've color-coded my recommendations:

  - <span class="legend-favorite">Orange</span>: Personal favorites that drastically changed how I see the world. These books are either unusually dense with insights or contain a single, transformative idea that provides a new model for the world. These are the rare books whose lessons have stuck with me long after reading.

  - <span class="legend-good">Green</span>: Strong recommendations that are well worth reading (and re-reading).

  - Rest: Everything else I've found interesting.

The book titles are links that take you to Amazon results for that specific book.

#### I hope you find something below that sparks your interest too!

## Shelf Catalog

{% set list = library | sort(false, false, 'author') %}
<ul class="books">
{% for b in list -%}
  {%- set amz = b.amazon -%}
  {%- if not amz and b.asin -%}
    {%- set amz = "https://www.amazon.com/dp/" ~ b.asin -%}
    {%- if site.amazonTag %}{% set amz = amz ~ "?tag=" ~ site.amazonTag %}{% endif -%}
  {%- endif -%}

  <li class="book{% if b.highlight %} {{ b.highlight }}{% endif %}">{% if amz -%}
    <a href="{{ amz }}" target="_blank" rel="noopener noreferrer"><strong>{{ b.title }}</strong></a>{% else -%}
    <strong>{{ b.title }}</strong>{% endif %}
       {{ b.author }}{% if b.year %} ({{ b.year }}){% endif %}{% if b.highlight == "favorite" %} 🌟{% endif %}{% if b.notes %} — <em>{{ b.notes }}</em>{% endif %}
  </li>
{%- endfor %}
</ul>
