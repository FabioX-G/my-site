---
layout: layouts/base.njk
title: 我的书架
permalink: /library/index.html
bodyClass: page--tight-top
---

# 我的书架
我读过/在读的书（持续更新）。🌟 = 强烈推荐

{% set list = library | sort(attribute='author') %}
<ul class="books">
{% for b in list %}
  {% set amz = b.amazon or ("https://www.amazon.com/dp/" + b.asin + (site.amazonTag ? ("?tag=" + site.amazonTag) : "")) %}
  <li class="book{% if b.highlight %} {{ b.highlight }}{% endif %}">
    <strong><a href="{{ amz }}" target="_blank" rel="noopener">{{ b.title }}</a></strong>
    — {{ b.author }}{% if b.year %}（{{ b.year }}）{% endif %}
    {% if b.highlight == "favorite" %} <span aria-label="favorite" title="强烈推荐">🌟</span>{% endif %}
    {% if b.notes %}<br><small>{{ b.notes }}</small>{% endif %}
  </li>
{% endfor %}
</ul>