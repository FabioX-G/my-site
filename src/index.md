---
layout: layouts/base.njk
title: Home
home: true
---

# Welcome to my site!

This is Fabio.

Born in Lisbon 🇵🇹, grew up in Shanghai 🇨🇳, studied at Syracuse University 🇺🇸, lived in Thailand 🇹🇭 for a while… and now I’m back in Portugal to work at **[Amora Vida](https://www.amora-vida.com/)**. (More [about me](/about/))

I share my [thoughts](/blog/) here from time to time to think and reflect.

In my free time, I enjoy reading nonfiction [books](/library/), training [Muay Thai](https://youtu.be/b-5bljm8tSk), playing soccer, [interviewing](https://youtu.be/034gmmUK8vc) friends, vibe-coding this personal website of mine, and spending time with my 10-year-old brother [Jason](https://youtu.be/dF_8LnEW9QU?si=Wl7bBf9lCH_KhuzK) (we play Brawl Stars & FC Mobile, brainstorm about his new novels, and read comic books before bedtime).


## Latest Essays
{% for post in collections.essay | sort(attribute='date') | reverse %}
  {% if loop.index0 < 3 %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | date('yyyy-LL-dd') }})
  {% endif %}
{% endfor %}



<p class="home-cta">
  · <a href="/essay/">See all essays →</a> 
  · <a href="/bookshelf/">My bookshelf →</a>
  · <a href="/quotes/">Quotes →</a>
</p>

Here is my [YouTube](https://www.youtube.com/@fabio_xie) channel.