---
layout: layouts/base.njk
title: 首页
home: true
---

# Welcome to my site!
I'm Fabio. I'm a 25yo founder currenly building my startup Amora Vida (real estate development) in Seixal, Portugal.

I share my [thoughts](/blog) irregularly to this site to think and reflect. 

2000: Born in Lisbon, Portugal 🇵🇹
2005 ~ 2019: Grew up in Shanghai, China 🇨🇳
2019 ~ 2024: Studied _Envinronment, Sustainability, and Policy_ and _Entrepreneurship and Emerging Enterprises_ at Syracuse University 🇺🇸 (After junior year, I moved to Thailand with my family and spent more than a year there, before going back to finish my bachelor's degree.)
2025 ~ now: Building Amora Vida Lda. in Portugal

In my free time, I enjoy reading books about science and technology, training muay thai, playing soccer, and spending time with my 10yo brother Jason (together we play brawl stars & FC mobile, and read before bedtime).

## Latest Essays
{% for post in collections.essay | sort(attribute='date') | reverse %}
  {% if loop.index0 < 3 %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | date('yyyy-LL-dd') }})
  {% endif %}
{% endfor %}