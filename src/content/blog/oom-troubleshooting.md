---
title: 记录一次OOM解决过程
description: 公司项目运行太久就OOM的排查与解决过程，涉及 ehcache 和 Hibernate 查询计划缓存的内存泄漏问题
pubDate: 2020-09-15T10:50:45.000Z
heroImage: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200
category: ["工作经验"]
draft: false
tags:
  - JAVA
  - JVM
  - 内存优化
---

公司最近有好几个类似的项目，都是运行太久就OOM了，理论上都是同一个问题，这里记录下排查过程。

远程过去服务器后，看到服务器内存就98了，系统、oracle等杂七杂八的东西8g内存已经所剩无几。

> 这里应该是要有图的，但是我没截图保存

公司的项目基本上都是用Tomcat跑的，但是Tomcat里面并没有默认开启JMX监控，所以先在Tomcat里面加上

JMX端口开放，方便监控。

首先在catalina.bat里面修改一下

~~~shell
set JAVA_OPTS=-Xms512m 
-Xmx1024m 
-XX:PermSize=128M 
-XX:MaxNewSize=256m 
-XX:MaxPermSize=256m 
-Dcom.sun.management.jmxremote 
-Dcom.sun.management.jmxremote.port=9009 
-Dcom.sun.management.jmxremote.authenticate=false 
-Dcom.sun.management.jmxremote.ssl=false
~~~

前面那几个是实施弄的，我这里就不改了，主要是加上jmx那几个，不然`JavaVisualVM`打开也监控不了。

下一步就是用`Java VisualVM`打开tomcat

然而一打开，就看到蓝色的使用堆大小橙色的堆空间大小基本上差不多了，点了下垃圾回收也没少太多，先重启保证系统。

> 这里也应该有图，但是我没保存

重启前我把堆Dump出来了，然后用Mat先看看泄漏情况。

![SUIzvG](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/15/SUIzvG.jpg)

![kEWlqk](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/15/kEWlqk.jpg)

> 下面都是我判断出来的，对这块并不是特别熟悉，可能对某些术语或者分析不对

上面看出主要有两个问题，一个是ehcache，一个是hiernate。

先看ehcache，本地缓存，这个调整下缓存策略就好了

![yIcuIf](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/15/yIcuIf.jpg)

稍微调整了一下最大容量以及过期时间。

下一个，hiernate，但是hiernate能有什么东西泄漏呢？

点进去详情，发现里面有个东西`org.hibernate.engine.query.spi.QueryPlanCache @ 0xc31ba138`百度找了下

https://stackoverflow.com/questions/31557076/spring-hibernate-query-plan-cache-memory-usage

里面大概是说查询计划缓存了sql，in里面参数不一样就拼命缓存。

解决方法的话两个咯，修改程序里面in，但是程序那里有in怎么找，这个就否决了。

另外一个就系设置它缓存大小

```xml
<prop key="hibernate.query.plan_cache_max_size">64</prop>
<prop key="hibernate.query.plan_parameter_metadata_max_size">32</prop>
<prop key="hibernate.query.plan_cache_max_soft_references">1024</prop>
<prop key="hibernate.query.plan_cache_max_strong_references">64</prop>
```

把修改的东西丢过去服务器，然后重启，在打开查看内存情况

![BBmD4u](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/15/BBmD4u.jpg)

理论上好了，但是不知道运行就了还会不会，最起码不超过750mb，有待补充吧。
