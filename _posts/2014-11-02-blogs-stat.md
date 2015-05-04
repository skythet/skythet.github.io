---
title: Қазақстан блогосферасының статистикалары
Category: Статистика
tags: статистика
image: kzblogs_stat.jpg
---

Қазақстандағы ең танымал блог жазылатын сайттар [kerekinfo.kz](http://kerekinfo/kz), [aitaber.kz](http://aitaber.kz), [massaget.kz](http://massaget.kz), [blogtime.kz](http://blogtime.kz) сайттарынан алынған мәліметтер негізіндегі статистика.

Өзім бір ойланып жүретін едім, Қазақстандағы блог қаншалықты дамуда және оның даму статистикасы қандай. Көп ойланбай еліміздегі ең танымал деген блог жазылатын сайттардан мәліметтер жинауды шештім. Олар: [kerekinfo.kz](http://kerekinfo/kz), [aitaber.kz](http://aitaber.kz), [massaget.kz](http://massaget.kz), [blogtime.kz](http://blogtime.kz).

Әр сайттан мақалалар туралы мәліметтер алында. Мақала туралы негізгі алынған мәліметтер: қаралымдар саны, таңдаулыға алынған саны, авторы туралы мәлімет, жазылған уақыты, пікірлер саны. Сонымен қатар, әрбір мақалаға жазылған пікірлер жайлы да мәліметтер алында. Бұл мақалада техникалық мәселелер туралы жазбаймын, тек қана статистика.

Маған жеңіл түскені төрт сайт та LiveStreet CMS-ін пайдаланатын болып шықты. Сонда да [massaget.kz](massaget.kz) сайтының қалған сайттардан өзгешелігі бар екен. Сондықтан ол сайттан, мақаланың таңдалымдар саны мен пікірлер үшін жоғары және төмен дауыс деген секілді мәліметтер алынбады.

*Мәлеметтерді алу бір аптадаға жуық уақыт алғандықтан. Сан жөнінен оңға-солға ауытқулар болады. Бірақ ауытқулар 1-2%-дан аспауы керек. Massaget.kz сайтынан тек блогтар деген бөлімдегі мақалалар алынды. Қалған жаңалықтар алынбады. Өйткені біз блогосфераның статистикасын жасап жатырмыз. Басқа да қызықты статистика көргілеріңіз келсе төменде пікір ретінде қалдыра аласыздар.*

# Мәліметті жинаудың техникалық жағы

Статистика үшін мәліметтер деректер қорына тікелей байланыссыз алынжы, бір күнде python тілінде скрипт жазылып мәліметтерді сақтау үшін mysql пайдаланылды. Барлық мәліметті алып болу үшін бір аптадай уақыт кетті. Скрипттің ең негізгі бөлігінің, мақаладан мәлімет алу функциясы:

{% highlight python %}
def parse_article(url):
    print url, "мақаласы туралы мәліметтерді алу"
    article_page = get_page_tree(url)
    date = dateutil.parser.parse(article_page.xpath(".//*[@class='topic-header']/.//time/@datetime")[0])
    blog_name = article_page.xpath(".//a[@class='topic-blog']/text()")[0]
    view_count = int(article_page.xpath(".//*[@class='viewcount-info']/text()")[0])
    favorites_count = int(article_page.xpath(".//*[contains(@id, 'fav_count_topic')]/text()")[0])
    author_link = article_page.xpath(".//*[@rel='author']/@href")[0]
    comments_count = int(article_page.xpath("count(.//section[starts-with(@class, 'comment') and not(contains(@class, 'comment-deleted'))])"))
    article_name = article_page.xpath(".//*[contains(@class, 'topic-title')]/text()")[0]

    author_id = parse_author_info(author_link)
    articleID = database.save_article(article_name, date, blog_name, view_count, favorites_count, author_id,
                               comments_count, url)
    parse_comments(article_page, comments_count, articleID)
{% endhighlight %}

Әр сайттан бірінші барлық блогтардың сілтемелері, одан соң әр блогтан мақалалар сілтемелері алынып, мақалалар сілтемелері жиналып алынды. Содан кейін жоғарыдағы функцияны қолдану арқылы әр мақала туралы мәліметтер алынды.

# Жалпы статистика

Барлығы __24726__ мақала, __395498__ пікір, __5649__ пайдаланушы туралы мәліметтер алынды. *Ескерту: тек мақала немесе пікір жазған пайдаланушылар алынды*.

Әр сайт бойынша:

| Сайт         | Мақалалар | Пікірлер |
|--------------|-----------|----------|
| kerekinfo.kz | 9770      | 231598   |
| massaget.kz  | 8806      | 91731    |
| aitaber.kz   | 4735      | 65708    |
| blogtime.kz  | 1415      | 6461     |

Ал енді графиктер.

# Әр айда жазылған мақалалар санының көрсеткіші

![Ай бойынша мақалалар саны](/assets/images/posts_by_month.png){: .center-image }

Ең жоғарғы көрсеткіш 2012 жылдың 3-айында болғанын көріп тұрмыз. Ал одан кейін шамалап алғанда бірқалыпта тұр. Кейінгі 2013 жылдың 10-айында болған серпінге massaget.kz сайты өз септігін тигізіпті. Ал соңғы айларда жалпы көрсеткіштің жоғары болуына blogtime.kz айтарлықтай үлес қосқан. Бірақ соңғы айда көрсеткіш төмендеп келеді.

# Әр айда жазылған пікірлер санының көрсеткіші

![Әр айда жазылған пікірлер санының көрсеткіші](/assets/images/comments_by_month.png){: .center-image }

Мұнда да мақалалар секілі 2012 жылы рекордтық көрсеткішті байқай аламыз, ал одан соң тек үлкен қарқынмен төмендеу. Соңғы серпін 2013 жылдың 8-айында байқалады, оған kerekinfo.kz сайтында болған серпін себепкер болған деп айта аламыз.

# Бір күндегі сағат бойынша жазылған мақалалар саны

![Бір күндегі сағат бойынша жазылатын мақалалар саны](/assets/images/posts_by_hour.png){: .center-image }

Таңғы 4 пен 9 арасында ең төмен көрсеткіш, не үшін екені түсінікті. Ал ең жоғарғы көрсеткіш кеші 18:00 мен түңгі 23:00-00:00 арасына келеді екен.

# Бір күндегі сағат бойынша жазылған пікірлер саны

![Бір күндегі сағат бойынша жазылған пікірлер саны](/assets/images/comments_by_hour.png){: .center-image }

Ал пікірлер 18:00 де ең көп жазылады екен.

# Апта күндеріне шаққандағы мақалалар саны

![Бір күндегі сағат бойынша жазылған пікірлер саны](/assets/images/posts_by_week_day.png){: .center-image }

Шынымды айтсам активтілік демалыс күндері төмендейді деп ойламаппын )). Пікірлердің активтілік графигінде де тура осы көрініс. Демалыс күндері мақала мен пікір жазушылар саны күрт төмендейді екен.

# Жалпы қаралымдар саны

Жалпы төрт сайт бойынша мақалалар қаралымдар санының қосындысы - __26 919 451__. Әр сайт бойынша:

![Әр сайт бойынша қаралымдар саны](/assets/images/views_count.png){: .center-image }

# Ал енді номинациялар

Ең көп мақала жазылған күн: __04 наурыз 2013 жыл, 63 мақала.__

Ең көп пікір жазылған күн: __20 ақпан 2012 жыл, 1335 пікір.__

1) Ең көп мақала жазғандар бестігі

| №   | Мақалалар саны | Автордың профиліне сілтеме |
|-----|----------------|----------------------------|
|1|721| [http://kerekinfo.kz/profile/asaubota/](http://kerekinfo.kz/profile/asaubota/) |
|2|621| [http://kerekinfo.kz/profile/Abilakim/](http://kerekinfo.kz/profile/Abilakim/) |
|3|444| [http://kerekinfo.kz/profile/satibaldi/](http://kerekinfo.kz/profile/satibaldi/) |
|4|346| [http://aitaber.kz/profile/m170785/](http://aitaber.kz/profile/m170785/) |
|5|262| [http://blogtime.kz/profile/AlmasNakhypbek/](http://blogtime.kz/profile/AlmasNakhypbek/) |

2) Бір күнде ең көп мақала жазғандар бестігі

| №   | Мақалалар саны | Автордың профиліне сілтеме |  Жазылған күн |
|-----|----------------|----------------------------|---------------|
| 1 | 15 | [http://massaget.kz/profile/55236/](http://massaget.kz/profile/55236/) | 2013-02-04 |
| 2 | 13 | [http://aitaber.kz/profile/Aknyet99/](http://aitaber.kz/profile/Aknyet99/) | 2012-01-29 |
| 3 | 13 | [http://massaget.kz/profile/61607/](http://massaget.kz/profile/61607/) | 2014-04-24 |
| 4 | 12 | [http://massaget.kz/profile/54963/](http://massaget.kz/profile/54963/) | 2013-01-19 |
| 5 | 11 | [http://massaget.kz/profile/58373/](http://massaget.kz/profile/58373/) | 2013-10-22 |

3) Ең көп пікір жазғандар

| №   | Пікірлер саны | Автордың профиліне сілтеме |
|-----|----------------|----------------------------|
|1|11714| [http://kerekinfo.kz/profile/asaubota/](http://kerekinfo.kz/profile/asaubota/)|
|2|9929| [http://kerekinfo.kz/profile/satibaldi/](http://kerekinfo.kz/profile/satibaldi/)|
|3|9641| [http://kerekinfo.kz/profile/Gastarbaiter/](http://kerekinfo.kz/profile/Gastarbaiter/)|
|4|7763| [http://kerekinfo.kz/profile/Abilakim/](http://kerekinfo.kz/profile/Abilakim/)|
|5|7360| [http://aitaber.kz/profile/qyrmyzy/](http://aitaber.kz/profile/qyrmyzy/)|

3) Бір күнде ең көп пікір жазғандар

| №   | Пікірлер саны | Автордың профиліне сілтеме |  Жазылған күн |
|-----|----------------|----------------------------|---------------|
|1|172| [http://kerekinfo.kz/profile/meirzhan/](http://kerekinfo.kz/profile/meirzhan/)|   2011-09-04|
|2|146| [http://aitaber.kz/profile/qyrmyzy/](http://aitaber.kz/profile/qyrmyzy/)|  2012-02-20|
|3|128| [http://kerekinfo.kz/profile/AL-ASTER](http://kerekinfo.kz/profile/AL-ASTER/)|   2011-09-04|
|4|124| [http://kerekinfo.kz/profile/Gastarbaiter/](http://kerekinfo.kz/profile/Gastarbaiter/)|   2011-06-03|
|5|118| [http://kerekinfo.kz/profile/kokbori/](http://kerekinfo.kz/profile/kokbori/)|    2012-02-10|

4) Ең көп қаралған мақалалар бестігі

| №   | Қаралымдар саны | Мақалаға сілтеме |  Мақала тақырыбы |
|-----|----------------|----------------------------|---------------|
|1|120752|  [http://kerekinfo.kz/blog/suret/2397.html](http://kerekinfo.kz/blog/suret/2397.html)| Секс туралы қызық фактілер  |
|2|116999|  [http://kerekinfo.kz/blog/boyannn/7282.html](http://kerekinfo.kz/blog/boyannn/7282.html)| Әйелдер және секс туралы айтылғандар  |
|3|85474|   [http://massaget.kz/blogs/3719/](http://massaget.kz/blogs/3719/)| Логикалық сұрақтар|
|4|80179|   [http://massaget.kz/blogs/7805/](http://massaget.kz/blogs/7805/)| Тіл туралы мақал-мәтелдер|
|5|75612|   [http://massaget.kz/blogs/1555/](http://massaget.kz/blogs/1555/) | Махаббат жайлы үздік 10 қазақша ән |

5) Ең көп пікірленген мақалалар бестігі

| №   | Пікірлер саны | Мақалаға сілтеме |
|-----|----------------|-------------------|
|1|795| [http://aitaber.kz/blog/blog/1957.html](http://aitaber.kz/blog/blog/1957.html)|
|2|702| [http://kerekinfo.kz/blog/suret/7502.html](http://kerekinfo.kz/blog/suret/7502.html)|
|3|701| [http://kerekinfo.kz/blog/debats/4653.html](http://kerekinfo.kz/blog/debats/4653.html)|
|4|633| [http://aitaber.kz/blog/clubflood/615.html](http://aitaber.kz/blog/clubflood/615.html)|
|5|551| [http://aitaber.kz/blog/blog/2892.html](http://aitaber.kz/blog/blog/2892.html)|

*Ескерту: төмендегі статистикада massaget.kz қатыспайды*

6) Жоғары дауыс жинаған пікірлер

| №   | Жоғары дауыс саны | Пікірге сілтеме |
|-----|----------------|-------------------|
|1|22|  [http://aitaber.kz/blog/blog/1957.html#comment26287](http://aitaber.kz/blog/blog/1957.html#comment26287)|
|2|22|  [http://kerekinfo.kz/blog/debats/6393.html#comment143425](http://kerekinfo.kz/blog/debats/6393.html#comment143425)|
|3|20|  [http://aitaber.kz/blog/blog/1957.html#comment26524](http://aitaber.kz/blog/blog/1957.html#comment26524)|
|4|19|  [http://kerekinfo.kz/blog/8716.html#comment217605](http://kerekinfo.kz/blog/8716.html#comment217605)|
|5|17|  [http://kerekinfo.kz/blog/9310.html#comment242468](http://kerekinfo.kz/blog/9310.html#comment242468)|

6) Төмен дауыс жинаған пікірлер

| №   | Төмен дауыс саны | Пікірге сілтеме |
|-----|----------------|-------------------|
|1|14|  [http://kerekinfo.kz/blog/narrator/7589.html#comment181108](http://kerekinfo.kz/blog/narrator/7589.html#comment181108)|
|2|12|  [http://kerekinfo.kz/blog/narrator/7589.html#comment181064](http://kerekinfo.kz/blog/narrator/7589.html#comment181064)|
|3|12|  [http://kerekinfo.kz/blog/10997.html#comment269928](http://kerekinfo.kz/blog/10997.html#comment269928)|
|4|12|  [http://aitaber.kz/blog/london2012/3022.html#comment47451](http://aitaber.kz/blog/london2012/3022.html#comment47451)|
|5|12|  [http://kerekinfo.kz/blog/Abilakim/2991.html#comment47743](http://kerekinfo.kz/blog/Abilakim/2991.html#comment47743)|

7) Бір күнде ең көп пікір қалдырылған мақалалар ондығы. (Неге он? Себебі ең көп талқыланғандар ең қызықтары болуы керек ;) )

| №   | Сілтеме        |     Пікірлер саны |  Пікірлер азылған күн| Мақала тақырыбы |
|-----|----------------|-------------------|----------------------|-------------------|
|1| [http://aitaber.kz/blog/clubflood/615.html](http://aitaber.kz/blog/clubflood/615.html) |    548 |2012-02-20|           Әйелім... болса деймін|
|2| [http://kerekinfo.kz/blog/suret/7502.html](http://kerekinfo.kz/blog/suret/7502.html)|       465 | 2012-02-16  |       Жұмыс үстеліміз қандай?  |
|3| [http://kerekinfo.kz/blog/debats/4653.html](http://kerekinfo.kz/blog/debats/4653.html) |    381 |2011-09-04  |     "Нақыл сөздер шайқасы" немесе "Сөзден сөз шығады"  |
|4| [http://kerekinfo.kz/blog/5804.html](http://kerekinfo.kz/blog/5804.html)    |   291|    2011-11-07  |       На то пошло, Мағауин маған ешкім емес!!!  |
|5| [http://kerekinfo.kz/blog/7511.html](http://kerekinfo.kz/blog/7511.html) |      279 |2012-02-17|            Дорбаңда не бар?  |
|6| [http://aitaber.kz/blog/blog/1957.html  ](http://aitaber.kz/blog/blog/1957.html)    |   277 |2012-06-01    |    Кел, танысайық!|
|7| [http://kerekinfo.kz/blog/kazkino/8755.html](http://kerekinfo.kz/blog/kazkino/8755.html)   | 272 |2012-06-08 |   Фильмды тап  
|8| [http://kerekinfo.kz/blog/6800.html     ](http://kerekinfo.kz/blog/6800.html)   |       252 |2012-01-08 |Келмей қойдың... (Реалистік поэзияның алтын қорынан)  |
|9| [http://kerekinfo.kz/blog/8748.html     ](http://kerekinfo.kz/blog/8748.html)   |       237 |2012-06-07 |"Қазақстан тоқалдары" журналының арнайы Euro-2012 шығарылымы  |
|10| [http://kerekinfo.kz/blog/8716.html        ](http://kerekinfo.kz/blog/8716.html)   |       215 |2012-06-01 |Керек Ата-аналар, мейрамдарың құтты болсын!  |

# Қорытынды

Көріп отырғанымыздай блог жазушыларды активтілігі (мақала жағынан да, комментарий жағынан да) төмендеп келе жатқаны байқалады. Бірақ бұл осындай бір кезеңге түсіп қалғандықтан да болуы мүмкін. Барлық рекордтар сонау 2012 жылдары ұрылған. Мүмкін оған көп уақыт өткені де септігін тигізген болуы мүмкін, бірақ олай болуының ықтималдығы, менің ойымша, өте төмен.

Тағы бір байқалғаны, мақаланы таңдаулылар қатарына алу функциясы өте кем пайдаланылады екен.
