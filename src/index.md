---
layout: layouts/base.njk
title: Home
home: true
---

# Welcome to my site!

I'm Fabio. I'm a 25-year-old founder currently building my startup **Amora Vida** (real estate development) in Seixal, Portugal.

I share my [thoughts](/blog/) here from time to time to think and reflect.

In my free time, I enjoy reading [books](/library/) about science and technology, training Muay Thai, playing soccer, and spending time with my 10-year-old brother Jason (we play Brawl Stars & FC Mobile, and read before bedtime).

- **2000** — Born in Lisbon, Portugal 🇵🇹  
- **2005–2019** — Grew up in Shanghai, China 🇨🇳  
- **2019–2024** — Studied *Environment, Sustainability, and Policy* and *Entrepreneurship and Emerging Enterprises* at Syracuse University 🇺🇸  
  *(After junior year, I moved to Thailand with my family and spent more than a year there, before going back to finish my bachelor's degree.)*  
- **2025–now** — Building **Amora Vida Lda.** in Portugal

## Latest Essays
{% for post in collections.essay | sort(attribute='date') | reverse %}
  {% if loop.index0 < 3 %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | date('yyyy-LL-dd') }})
  {% endif %}
{% endfor %}



[See all essays →](/blog/) · [My book shelf →](/library/)