---
layout: layouts/base.njk
title: Home
home: true
---

# Welcome to my site!

This is Fabio. I currently live in Portugal and work at **[Amora Vida](https://www.amora-vida.com/)**.

I grew up in Shanghai, China, and previously studied at Syracuse University. (More [about me](/about/))

I share my [thoughts](/blog/) here from time to time to think and reflect.

In my free time, I enjoy reading nonfiction [books](/library/), training Muay Thai, playing soccer, and spending time with my 10-year-old brother Jason (we play Brawl Stars & FC Mobile, and read comics before bedtime).


## Latest Essays
{% for post in collections.essay | sort(attribute='date') | reverse %}
  {% if loop.index0 < 3 %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | date('yyyy-LL-dd') }})
  {% endif %}
{% endfor %}



<p class="home-cta">
  · <a href="/blog/">See all essays →</a> 
  · <a href="/library/">My bookshelf →</a>
  · <a href="/quotes/">Quotes →</a>
</p>