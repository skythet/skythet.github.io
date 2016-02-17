---
title: dpkg-buildpackage: "is not stattable Not a directory"
category: linux
tags: debpackage, deb, linux, packages
---

Пакет жинау кезінде мынандай қызық қателікке тап болдым. Алдын ешқандай
қателіксіз жиналып жүрген пакетте `/etc/cron.d/jstat` орындау барысында 
күтпеген жерден мынандай қателік пайда болды

```
dpkg-deb: error: conffile `/etc/logrotate.d/jstat/etc/cron.d/jstat' is not stattable: Not a directory
dh_builddeb: dpkg-deb --build debian/utils .. returned exit code 2
debian/rules:13: recipe for target 'binary' failed
make: *** [binary] Error 1
dpkg-buildpackage: error: fakeroot debian/rules binary gave error exit status 2
```

"Хм" мүлдем түсініксіз қателік. Соңғы өзгерткенім ол, "debian/conffiles" файлын
қосқан болатынмын:

```
/etc/logrotate.d/jstat
/etc/cron.d/jstat
```

Қарапйым файл, екі ғана қатар жазу бар. Қателікте олар бірігіп кетіп отқан секілді.
Гуглдан ештеңе табылмады. Алдын crontab файлдарымен жұмыс жасағанда да
осындай қызық болған еді. Crontab файлдарда ең соңында бос қатар қалдырмасаң
баптаулар қабылданбай қалады (ескі нұсқаларда, жаңа нұсқада тураланған).

Сену қиын бірақ мұнда да файлдың соңына бос орын қосқан соң, қателік жоқ
болып пакет қайтадан қалыпты түрде жинала бастады:

```
/etc/logrotate.d/jstat
/etc/cron.d/jstat

```

Неге бұлай болатынын таба алмадым. Мүмкін дұрыс іздемеген шығармын.
Егер біреу міреу гуглдан келіп тұрса, уақытын үнемдедім деп ойлаймын).
