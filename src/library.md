---
layout: layouts/base.njk
title: Bookshelf
permalink: /library/index.html
bodyClass: page--tight-top
---

# Bookshelf

Welcome to my digital bookshelf!

For a long time, school tricked me into thinking reading was a chore. I've since found the antidote: 

> follow your own curiosity relentlessly.

This digital bookshelf is the result of that philosophy. It is a living catalog of (most of) my physical books, guided by whatever subject interests me most at any given moment.

To help you navigate, I've color-coded my recommendations:

  - Orange: Personal favorites that drastically changed how I see the world. These books are either unusually dense with insights or contain a single, transformative idea that provides a new model for the world. These are the rare books whose lessons have stuck with me long after reading.

  - Green: Strong recommendations that are well worth reading (and re-reading).

  - Blue: Everything else I've found interesting.

The book titles are links that will take you to the Amazon page for the edition I own.

#### I hope you find something below that sparks your interest too!

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