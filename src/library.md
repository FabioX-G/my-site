---
layout: layouts/base.njk
title: 我的书架
---

# 我的书架
我读过/在读的书：

{% for b in library %}
- **{{ b.title }}** ({{ b.author }}{% if b.year %}, {{ b.year }}{% endif %})
{% endfor %}
